import {Break, BreakClip, MediaInformation} from "chromecast-caf-receiver/cast.framework.messages";
import {AdDescription, AdSource} from "./AdDescription";
import {SourceDescription} from "../source/SourceDescription";

export class CSAIAdsConfigEnricher {

    constructor(private readonly _ads: AdDescription[]) {
    }

    addClipToBreaks(breaks: Break[], clip: BreakClip, position: number) {
        let hasPosition = false;
        let breakIndex = null;
        breaks.forEach((element, index) => {
            if (element.position == position) {
                hasPosition = true;
                breakIndex = index;
            }
        })
        if (hasPosition && (breakIndex !== null)) {
            breaks[breakIndex].breakClipIds.push(clip.id);
        } else {
            const messageBreak : Break = {
                id: "b"+(breaks.length+1),
                breakClipIds: ["bc1"],
                position: position,
                isWatched: false
            }
            breaks.push(messageBreak);
        }
    }

    // Enrich PlaybackConfig with KeySystem configuration properties.
    enrich(mediaInformation: MediaInformation) {
        const breakClips : BreakClip[] = [];
        const breaks : Break[] = [];
        this._ads.forEach((ad, index) => {
            const adSource : AdSource = ad.sources;
            const isVMAP = (ad.timeOffset === null);
            if (isVMAP) {
                mediaInformation.vmapAdsRequest = {
                    adTagUrl: adSource.src
                }
            } else {
                let position : number;
                if (typeof ad.timeOffset === 'string') {
                    if (ad.timeOffset == "start") {
                        position = 0;
                    } else {
                        position = -1;
                    }
                } else {
                    position = ad.timeOffset;
                }
                const breakClip : BreakClip = {
                    id: "bc"+index,
                    title: "bc"+index,
                    vastAdsRequest: {
                        adTagUrl: adSource.src
                    }
                }
                breakClips.push(breakClip);
                this.addClipToBreaks(breaks, breakClip, position);
            }
        })
        mediaInformation.breakClips = breakClips;
        mediaInformation.breaks = breaks;
    }

    static getCSAI(sourceDescription : SourceDescription): undefined | AdDescription[] {
        if (sourceDescription.ads && sourceDescription.ads.length > 0) {
            return sourceDescription.ads;
        }
        return undefined;
    }
}

