export interface PreplayResponse {
    ads: PreplayAdsResponse;
}

export interface PreplayAdsResponse {
    breaks: PreplayBreaksResponse[];
}

export interface PreplayBreaksResponse {
    ads: PreplayBreaksAdResponse[];
    duration: number;
    timeOffset: number;
}

export interface PreplayBreaksAdResponse {
    duration: number;
}