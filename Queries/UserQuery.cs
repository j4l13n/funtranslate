using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

public class UserQuery
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
}
