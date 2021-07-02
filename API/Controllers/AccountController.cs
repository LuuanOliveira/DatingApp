using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, 
            ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (string.IsNullOrEmpty(registerDto.UserName))
                return BadRequest("Usuário Inválido");

            if (string.IsNullOrEmpty(registerDto.Password))
                return BadRequest("Senha Inválida");

            if (await UserExists(registerDto.UserName)) return BadRequest("O nome de usuário já está em uso");

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {   
                UserName = registerDto.UserName.ToLower(),
                KnownAs = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(registerDto.UserName.ToLower()),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto 
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);

            if (user == null) return Unauthorized("Usuário Inválido");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int count = 0; count < computedHash.Length; count++)
            {
                if (computedHash[count] != user.PasswordHash[count]) return Unauthorized("Senha Inválida");
            }
            
            return new UserDto 
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}