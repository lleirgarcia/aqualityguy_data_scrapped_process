
interface FormattedComment {
    mainComment: string;
    replies: string[];
}

interface FormattedJSON {   
    videoDesc: string;
    url: string;
    totalLikes: string;
    totalComments: string;
    videoViews: string;
    comments: FormattedComment[];
}

interface FomattedJSONShortAnswer {   
    videoDesc: string;
    comments: FormattedComment[];
}