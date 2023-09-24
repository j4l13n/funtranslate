using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace funtranslate.Controllers;

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

    [HttpGet("translate")]
    public async Task<IActionResult> TranslateAsync([FromQuery] string text, [FromQuery] string targetLanguage)
    {
        try
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
        catch (Exception ex)
        {
            // Handle exceptions here
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}

