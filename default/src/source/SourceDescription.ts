import { DrmConfiguration } from "./DrmConfiguration";
import {AdDescription} from "../ads/AdDescription";

/**
 * NOTICE: the SourceDescription interfaces in this file are limited to the properties required in the
 * SampleReceiver app.
 *
 * For a full reference we refer to the API documentation:
 * https://docs.theoplayer.com/api-reference/web/theoplayer.sourcedescription.md
 */

/**
 * Describes the configuration of a player's source.
 *
 * @public
 */
export interface SourceDescription {
    sources: Source[];
    ads: AdDescription[];
}

/**
 * Represents a media resource characterized by a URL to the resource and optionally information about the resource.
 *
 * @public
 */
export interface Source {
    integrationData: IntegrationData;

    /**
     * The source URL of the media resource.
     */
    src: string | undefined;

    /**
     * The content protection parameters for the media resource.
     */
    contentProtection: DrmConfiguration | undefined;
}

export interface IntegrationData {
    preplayResponse: any;
    source: any;
}