using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace FunTranslate.Tests.UnitTests
{
    public class FunTranslateControllerTests
    {
        [Fact]
        public async Task GetUsers_ReturnsOkResult()
        {
            // Arrange
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            var httpClientMock = new Mock<HttpClient>();
            httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>())).Returns(httpClientMock.Object);
            var controller = new FunTranslateController((IHttpClientFactory)httpClientFactoryMock); // Pass a mock IHttpClientFactory here

            // Act
            var result = await controller.GetUsers();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task RegisterUser_WithValidData_ReturnsOkResult()
        {
            // Arrange
            var dbContextOptions = new DbContextOptionsBuilder<FunTranslateContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var dbContext = new FunTranslateContext();
            var controller = new FunTranslateController(null); // Pass a mock IHttpClientFactory here
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            controller.HttpContext.Request.Headers["Authorization"] = "Bearer k3j4h5gh43jk4j5h6jg5h4jlkj5h4j3k4jn5btnm3";

            // Act
            var result = await controller.RegisterUser(new User
            {
                Email = "test@example.com",
                Password = "testpassword"
            });

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        // Add more test methods for other controller actions...
    }
}
