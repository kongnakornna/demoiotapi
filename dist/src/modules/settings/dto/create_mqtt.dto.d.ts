export declare class CreateMqttDto {
    mqtt_type_id: number | null;
    sort?: number;
    mqtt_name: string;
    host: string;
    port: number | null;
    username?: string | null;
    password?: string | null;
    secret?: string | null;
    expire_in?: string | null;
    token_value?: string;
    org?: string | null;
    bucket?: string | null;
    envavorment?: string | null;
    status?: number;
    location_id?: number | null;
    latitude?: string | null;
    longitude?: string | null;
    mqtt_main_id?: number;
    configuration: string;
}
