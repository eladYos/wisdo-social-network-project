export class CreatePostDto {
  public title: string;
  public summary?: string;
  public body: string;
  public authorId: string;
  public communityId: string;
  public status: string;
}
