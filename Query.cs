using Microsoft.EntityFrameworkCore;

public class Query
{
    [UseFiltering]
    public List<User> GetUsers()
    {
        using var db = new FunTranslateContext();
        var users = (from b in db.Users
                    orderby b.Email
                    select b).ToList();
        return users;
    }

    public List<Record> GetRecords()
    {
        using var db = new FunTranslateContext();
        
        var records = (from b in db.Records
                    orderby b.InputText
                    select b).ToList();
        return records;
    }
}