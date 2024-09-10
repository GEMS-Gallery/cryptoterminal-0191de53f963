import Bool "mo:base/Bool";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    content: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Get all posts
  public query func getPosts() : async [Post] {
    posts
  };

  // Get a specific post by ID
  public query func getPost(id: Nat) : async ?Post {
    Array.find(posts, func (post: Post) : Bool { post.id == id })
  };

  // Add a new post
  public func addPost(title: Text, content: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      content = content;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    post.id
  };
}
