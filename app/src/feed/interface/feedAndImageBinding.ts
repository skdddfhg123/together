import { FeedImage } from "src/db/feedImage/entities/feedImage.entity";
import { Feed } from "../entities/feed.entity";


export interface FeedImageBinded {
  feed: Feed;
  feedImages: FeedImage[];
}

