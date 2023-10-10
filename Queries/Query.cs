public class Query
{
    public UserQuery Users { get; } = new UserQuery();
    public RecordQuery Records { get; } = new RecordQuery();
}