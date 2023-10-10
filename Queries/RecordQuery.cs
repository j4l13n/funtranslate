using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

public class RecordQuery
{
    [UseFiltering]
    public List<Record> GetRecords()
    {
        using var db = new FunTranslateContext();
        var records = (from b in db.Records
                       orderby b.InputText
                       select b).ToList();
        return records;
    }
}
