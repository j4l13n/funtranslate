using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class FunTranslateContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Record> Records { get; set; }

    public string DbPath { get; }

    public FunTranslateContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "funtranslate.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public List<Record> Records { get; } = new();
}

public class Record
{
    public int Id { get; set; }
    public string InputText { get; set; }
    public string FunText { get; set; }
    public string TargetLanguage { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}