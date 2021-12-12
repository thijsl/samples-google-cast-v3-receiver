import {Break, BreakClip, MediaInformation} from "chromecast-caf-receiver/cast.framework.messages";
import {SourceDescription} from "../source/SourceDescription";
import {PreplayResponse} from "./PreplayResponse";
import {SSAIConfig} from "./SSAIConfig";

export class SSAIAdsConfigEnricher {

    constructor(private readonly _ssai: SSAIConfig) {
    }

    // Enrich PlaybackConfig with KeySystem configuration properties.
    enrich(mediaInformation: MediaInformation) {
        mediaInformation.breakClips = this._ssai.breakClips;
        mediaInformation.breaks = this._ssai.breaks;
    }

    static getSSAI(sourceDescription : SourceDescription): undefined | SSAIConfig {
        function getEdgeCastSSAIConfig(preplayResponse : PreplayResponse) : SSAIConfig {
            const breakClips : BreakClip[] = [];
            const breaks : Break[] = [];
            const preplayBreaks = preplayResponse.ads.breaks;
            preplayBreaks.forEach((preplayBreak, index) => {
                const cafBreak : Break = {
                    breakClipIds: [],
                    id: "b"+index,
                    isWatched: false,
                    position: preplayBreak.timeOffset
                };
                preplayBreak.ads.forEach((preplayBreakAd, index2) => {
                    const breakClip : BreakClip = {
                        id: 'bc'+index2,
                        title: 'bc'+index2,
                        duration: preplayBreakAd.duration
                    };
                    breakClips.push(breakClip);
                    cafBreak.breakClipIds.push(breakClip.id);
                });
                breaks.push(cafBreak);
            });
            const ssaiConfig : SSAIConfig = {
                breakClips: breakClips,
                breaks: breaks
            }
            return ssaiConfig;
        }
        if (sourceDescription.sources && sourceDescription.sources[0]) {
            const source = sourceDescription.sources[0];
            if (source.integrationData) {
                const integrationData = source.integrationData;
                const isEdgeCastSSAI = (integrationData.preplayResponse && integrationData.source && (integrationData.source.integration == "verizon-media"));
                if (isEdgeCastSSAI) {
                    const ssaiConfig : SSAIConfig = getEdgeCastSSAIConfig(integrationData.preplayResponse);
                    return ssaiConfig;
                }
            }
        }
        return undefined;
    }
}

