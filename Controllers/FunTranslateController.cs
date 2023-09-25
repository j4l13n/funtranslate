// using funtranslate.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
// namespace funtranslate.Controllers.FunTranslateController;


public class TranslationResponse
{
    public SuccessInfo Success { get; set; }
    public TranslationContents Contents { get; set; }
}

public class SuccessInfo
{
    public int Total { get; set; }
}

public class TranslationContents
{
    public string Translated { get; set; }
    public string Text { get; set; }
    public string Translation { get; set; }
}


[ApiController]
[Route("[controller]")]
public class FunTranslateController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _funTranslationsApiUrl = "http://api.funtranslations.com/translate";

    public FunTranslateController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        using (var db = new FunTranslateContext())
        {
            var users = await db.Users.ToListAsync();
            return Ok(users);
        }

    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> RegisterUser([FromBody] User user)
    {
        try
        {
            using (var db = new FunTranslateContext())
            {
                if (user == null)
                {
                    return BadRequest("Invalid registration data.");
                }
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                var newUser = await db.AddAsync(new User { Email = user.Email, Password = hashedPassword });
                await db.SaveChangesAsync();
                return Ok("Successfully registered!");
            }
        }
        catch (Exception ex)
        {
            // Handle exceptions here
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        try
        {
            using (var db = new FunTranslateContext())
            {
                if (user == null)
                {
                    return BadRequest("Invalid registration data.");
                }
                var userData = await db.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

                if (userData == null)
                {
                    return NotFound("User not found.");
                }

                // Check if the provided password matches the stored hashed password
                bool passwordMatch = BCrypt.Net.BCrypt.Verify(user.Password, userData.Password);

                if (passwordMatch)
                {
                    // Passwords match; the user is authenticated
                    return Ok("Login successful!");
                }
                else
                {
                    // Passwords don't match; return a failed login response
                    return BadRequest("Invalid email or password.");
                }
            }
        }
        catch (Exception ex)
        {
            // Handle exceptions here
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("records")]
    public async Task<IActionResult> GetRecords()
    {
        using (var db = new FunTranslateContext())
        {
            // var records = await db.Records.ToListAsync();
            var records = (from b in db.Records
                    orderby b.InputText
                    select b).ToList();
            return (IActionResult)records;
        }

    }

    [HttpGet("record")]
    public async Task<IActionResult> GetRecord([FromQuery] int id)
    {
        using (var db = new FunTranslateContext())
        {
            var record = db.Records.Where(e => e.Id == id);
            return Ok(record);
        }

    }


    [HttpGet("translate")]
    public async Task<IActionResult> TranslateAsync([FromQuery] string text, [FromQuery] string targetLanguage)
    {
        try
        {
            using (var db = new FunTranslateContext())
            {
                if (string.IsNullOrWhiteSpace(text) || string.IsNullOrWhiteSpace(targetLanguage))
                {
                    return BadRequest("Both 'text' and 'targetLanguage' query parameters are required.");
                }

                // Build the URL for the FunTranslations API
                string apiUrl = $"{_funTranslationsApiUrl}/{targetLanguage}.json?text={Uri.EscapeDataString(text)}";


                // Make the API request
                var httpClient = _httpClientFactory.CreateClient();
                var httpResponseMessage = await httpClient.GetAsync(apiUrl);
                // HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

                if (httpResponseMessage.IsSuccessStatusCode)
                {
                    string responseBody = await httpResponseMessage.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<TranslationResponse>(responseBody);
                    if (response != null)
                    {
                        string translatedText = response.Contents.Translated;
                        string originalText = response.Contents.Text;
                        string translationType = response.Contents.Translation;
                        await db.AddAsync(
                            new Record { InputText = originalText, FunText = translatedText, TargetLanguage = translationType, UserId = 0 }
                        );
                        await db.SaveChangesAsync();
                        // You can parse and process the response JSON here
                        // For simplicity, let's just return the raw response for now
                        return Ok(responseBody);
                    }
                    else
                    {
                        // Handle API error responses here
                        return BadRequest("Failed to fetch translation from FunTranslations API.");
                    }
                }
                else
                {
                    // Handle API error responses here
                    return BadRequest("Failed to fetch translation from FunTranslations API.");
                }
            }
        }
        catch (Exception ex)
        {
            // Handle exceptions here
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}

