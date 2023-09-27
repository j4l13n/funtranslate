using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using HotChocolate;
using HotChocolate.Types;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;

public class LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public User Data { get; set; }
    public string Token { get; set; }
}

public class RecordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public Record Data { get; set; }
}

public class Mutation
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _funTranslationsApiUrl = "http://api.funtranslations.com/translate";


    public Mutation([Service] IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    private const string SecretKey = "2k3j4h5ghj4k3l4k5jh65j4k3"; // Replace with your actual secret key
    private const string Issuer = "julien";         // Replace with your actual issuer
    private const string Audience = "clients";     // Replace with your actual audience
    private const int ExpirationMinutes = 30;            // Replace with your desired expiration time

    public string GenerateJwtToken(string username)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username), // You can include additional claims here
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(ExpirationMinutes),
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }

    public async Task<User> Register(string email, string password)
    {
        try
        {
            using (var db = new FunTranslateContext())
            {
                var user = new User
                {
                    Email = email,
                    Password = BCrypt.Net.BCrypt.HashPassword(password)
                };

                db.Add(user);
                await db.SaveChangesAsync();

                return user;
            }
        }
        catch (Exception ex)
        {
            throw new Exception("User registration failed: " + ex.Message);
        }
    }

    public async Task<LoginResponse> Login(string email, string password)
    {
        try
        {
            using (var db = new FunTranslateContext())
            {
                var userData = db.Users.FirstOrDefault(u => u.Email == email);

                // Check if the provided password matches the stored hashed password
                bool passwordMatch = BCrypt.Net.BCrypt.Verify(password, userData.Password);

                if (passwordMatch)
                {
                    // Passwords match; the user is authenticated

                    var tokenString = GenerateJwtToken(email);

                    // Return the LoginResponse with the JWT token
                    return new LoginResponse
                    {
                        Success = true,
                        Message = "Logged in Successfully",
                        Data = userData,
                        Token = tokenString // Include the JWT token in the response
                    };
                }
                else
                {
                    // Passwords don't match; return a failed login response
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password.",
                        Data = null
                    };
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception("User registration failed: " + ex.Message);
        }
    }

    public async Task<RecordResponse> AddRecord(string originalText, string targetLanguage, int userId)
    {
        try
        {
            using (var db = new FunTranslateContext())
        {
            if (string.IsNullOrWhiteSpace(originalText) || string.IsNullOrWhiteSpace(targetLanguage))
            {
                return new RecordResponse
                {
                    Success = false,
                    Message = "Both 'text' and 'targetLanguage' query parameters are required.",
                    Data = null
                };
            }
            // Build the URL for the FunTranslations API
            string apiUrl = $"{_funTranslationsApiUrl}/{targetLanguage}.json?text={Uri.EscapeDataString(originalText)}";
            // Make the API request
            var httpClient = _httpClientFactory.CreateClient();
            var httpResponseMessage = await httpClient.GetAsync(apiUrl);

            if (httpResponseMessage.IsSuccessStatusCode)
            {
                string responseBody = await httpResponseMessage.Content.ReadAsStringAsync();
                var response = JsonConvert.DeserializeObject<TranslationResponse>(responseBody);
                if (response != null)
                {
                    string translatedText = response.Contents.Translated;
                    string translationType = response.Contents.Translation;
                    Record record = new Record { InputText = originalText, FunText = translatedText, TargetLanguage = translationType, UserId = userId };
                    await db.AddAsync(record);
                    await db.SaveChangesAsync();
                    // You can parse and process the response JSON here
                    // For simplicity, let's just return the raw response for now
                    return new RecordResponse
                    {
                        Success = true,
                        Message = "Successfully saved new fun translate text",
                        Data = null
                    };
                }
                else
                {
                    // Handle API error responses here
                    return new RecordResponse
                    {
                        Success = false,
                        Message = "Something is wrong",
                        Data = null
                    };
                }
            }
            else
            {
                // Handle API error responses here
                return new RecordResponse
                {
                    Success = false,
                    Message = "Something is wrong",
                    Data = null
                };
            }
        }
        }
        catch (Exception e) {
            return new RecordResponse
            {
                Success = false,
                Message = "Something wrong" + e,
                Data = null
            };
        }
    }
}
