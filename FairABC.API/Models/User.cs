using System.ComponentModel.DataAnnotations;

namespace FairABC.API.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public required string FirstName { get; set; }
    
    [Required]
    [StringLength(50)]
    public required string LastName { get; set; }
    
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public required string Email { get; set; }
    
    [Required]
    [StringLength(100)]
    public required string Password { get; set; }
    
    [Required]
    public UserType UserType { get; set; }
    
    [StringLength(100)]
    public string? CompanyName { get; set; }
}

public enum UserType
{
    Customer,
    Company
} 