--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'SUPERADMIN',
    'ADMIN',
    'EDITOR',
    'MONITOR',
    'USER'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

--
-- Name: user_usertype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_usertype_enum AS ENUM (
    'therapist',
    'supervisor',
    'superadmin',
    'system',
    'admin',
    'support',
    'enduser'
);


ALTER TYPE public.user_usertype_enum OWNER TO postgres;

--
-- Name: sd_admin_access_menu_admin_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_admin_access_menu_admin_access_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sd_admin_access_menu_admin_access_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sd_admin_access_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_admin_access_menu (
    admin_access_id integer DEFAULT nextval('public.sd_admin_access_menu_admin_access_id_seq'::regclass) NOT NULL,
    admin_type_id integer,
    admin_menu_id integer
);


ALTER TABLE public.sd_admin_access_menu OWNER TO postgres;

--
-- Name: sd_admin_access_menu_admin_access_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_admin_access_menu_admin_access_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_admin_access_menu_admin_access_id_seq1 OWNER TO postgres;

--
-- Name: sd_admin_access_menu_admin_access_id_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_admin_access_menu_admin_access_id_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_admin_access_menu_admin_access_id_seq2 OWNER TO postgres;

--
-- Name: sd_alarm_process_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log OWNER TO postgres;

--
-- Name: sd_alarm_process_log_email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log_email (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log_email OWNER TO postgres;

--
-- Name: sd_alarm_process_log_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log_line (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log_line OWNER TO postgres;

--
-- Name: sd_alarm_process_log_sms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log_sms (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log_sms OWNER TO postgres;

--
-- Name: sd_alarm_process_log_telegram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log_telegram (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log_telegram OWNER TO postgres;

--
-- Name: sd_alarm_process_log_temp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_alarm_process_log_temp (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer,
    type_id integer,
    event character varying(255),
    alarm_type character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    status character varying(150),
    date character varying(100) NOT NULL,
    "time" character varying(50) NOT NULL,
    data character varying(255),
    data_alarm character varying(255),
    alarm_status character varying(255),
    subject character varying(255),
    content character varying(255),
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_alarm_process_log_temp OWNER TO postgres;

--
-- Name: sd_device_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_device_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_device_log_id_seq OWNER TO postgres;

--
-- Name: sd_device_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_device_log (
    id integer DEFAULT nextval('public.sd_device_log_id_seq'::regclass) NOT NULL,
    type_id integer NOT NULL,
    sensor_id integer NOT NULL,
    name character varying(255) NOT NULL,
    data character varying(255) NOT NULL,
    status integer,
    lang character varying(50),
    "create" timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_device_log OWNER TO postgres;

--
-- Name: sd_iot_alarm_device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_alarm_device (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer
);


ALTER TABLE public.sd_iot_alarm_device OWNER TO postgres;

--
-- Name: sd_iot_alarm_device_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_alarm_device_event (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    alarm_action_id integer,
    device_id integer
);


ALTER TABLE public.sd_iot_alarm_device_event OWNER TO postgres;

--
-- Name: sd_iot_api_api_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_api_api_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_api_api_id_seq OWNER TO postgres;

--
-- Name: sd_iot_api; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_api (
    api_id integer DEFAULT nextval('public.sd_iot_api_api_id_seq'::regclass) NOT NULL,
    api_name character varying(255) NOT NULL,
    host integer,
    port character varying(255) NOT NULL,
    token_value text,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_api OWNER TO postgres;

--
-- Name: sd_iot_device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device (
    device_id integer NOT NULL,
    setting_id integer,
    type_id integer,
    location_id integer,
    device_name character varying(255),
    sn character varying(255),
    hardware_id integer,
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    time_life integer,
    period character varying(150),
    work_status integer,
    max character varying(150),
    min character varying(150),
    model character varying(255),
    vendor character varying(255),
    comparevalue character varying(255),
    unit character varying(255),
    mqtt_id integer,
    oid character varying(255),
    action_id integer,
    status_alert_id integer,
    mqtt_data_value character varying(255),
    mqtt_data_control character varying(255),
    measurement character varying(255),
    mqtt_control_on character varying(255),
    mqtt_control_off character varying(255),
    org character varying(255) NOT NULL,
    bucket character varying(255) NOT NULL,
    status integer,
    mqtt_device_name character varying(255) NOT NULL,
    mqtt_status_over_name character varying(255) NOT NULL,
    mqtt_status_data_name character varying(255) NOT NULL,
    mqtt_act_relay_name character varying(255) NOT NULL,
    mqtt_control_relay_name character varying(255) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_iot_device OWNER TO postgres;

--
-- Name: sd_iot_device_action_device_action_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_action_device_action_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_action_device_action_user_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device_action (
    device_action_user_id integer DEFAULT nextval('public.sd_iot_device_action_device_action_user_id_seq'::regclass) NOT NULL,
    alarm_action_id integer,
    device_id integer
);


ALTER TABLE public.sd_iot_device_action OWNER TO postgres;

--
-- Name: sd_iot_device_action_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_action_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_action_log_log_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_action_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device_action_log (
    log_id integer DEFAULT nextval('public.sd_iot_device_action_log_log_id_seq'::regclass) NOT NULL,
    alarm_action_id integer,
    device_id integer,
    uid character varying(255),
    status integer,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_iot_device_action_log OWNER TO postgres;

--
-- Name: sd_iot_device_action_user_device_action_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_action_user_device_action_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_action_user_device_action_user_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_action_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device_action_user (
    device_action_user_id integer DEFAULT nextval('public.sd_iot_device_action_user_device_action_user_id_seq'::regclass) NOT NULL,
    alarm_action_id integer,
    uid character varying(255)
);


ALTER TABLE public.sd_iot_device_action_user OWNER TO postgres;

--
-- Name: sd_iot_device_alarm_action_alarm_action_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_alarm_action_alarm_action_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_alarm_action_alarm_action_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_alarm_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device_alarm_action (
    alarm_action_id integer DEFAULT nextval('public.sd_iot_device_alarm_action_alarm_action_id_seq'::regclass) NOT NULL,
    action_name character varying(255),
    status_warning character varying(150),
    recovery_warning character varying(150),
    status_alert character varying(150),
    recovery_alert character varying(150),
    email_alarm integer,
    line_alarm integer,
    telegram_alarm integer,
    sms_alarm integer,
    nonc_alarm integer,
    time_life integer,
    event integer,
    status integer
);


ALTER TABLE public.sd_iot_device_alarm_action OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq2 OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq2; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_device_device_id_seq2 OWNED BY public.sd_iot_device.device_id;


--
-- Name: sd_iot_device_device_id_seq3; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq3
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq3 OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq3; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_device_device_id_seq3 OWNED BY public.sd_iot_device.device_id;


--
-- Name: sd_iot_device_device_id_seq4; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq4
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq4 OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq4; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_device_device_id_seq4 OWNED BY public.sd_iot_device.device_id;


--
-- Name: sd_iot_device_device_id_seq5; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_device_id_seq5
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_device_id_seq5 OWNER TO postgres;

--
-- Name: sd_iot_device_device_id_seq5; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_device_device_id_seq5 OWNED BY public.sd_iot_device.device_id;


--
-- Name: sd_iot_device_device_id_seq6; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_iot_device ALTER COLUMN device_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sd_iot_device_device_id_seq6
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sd_iot_device_type_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_device_type_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_device_type_type_id_seq OWNER TO postgres;

--
-- Name: sd_iot_device_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_device_type (
    type_id integer DEFAULT nextval('public.sd_iot_device_type_type_id_seq'::regclass) NOT NULL,
    type_name character varying(255) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_device_type OWNER TO postgres;

--
-- Name: sd_iot_email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_email (
    email_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email_name character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    port integer,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_email OWNER TO postgres;

--
-- Name: sd_iot_email_email_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_email_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_email_email_id_seq OWNER TO postgres;

--
-- Name: sd_iot_email_email_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_email_email_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_email_email_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_email_host_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_email_host_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_email_host_id_seq OWNER TO postgres;

--
-- Name: sd_iot_email_host_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_email_host_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_email_host_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_group_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_group_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_group_group_id_seq OWNER TO postgres;

--
-- Name: sd_iot_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_group (
    group_id integer DEFAULT nextval('public.sd_iot_group_group_id_seq'::regclass) NOT NULL,
    group_name character varying(255) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_group OWNER TO postgres;

--
-- Name: sd_iot_group_group_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_group_group_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_group_group_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_host; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_host (
    host_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    host_name character varying(255) NOT NULL,
    port character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_host OWNER TO postgres;

--
-- Name: sd_iot_influxdb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_influxdb (
    influxdb_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    influxdb_name character varying(255) NOT NULL,
    host integer,
    port character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    token_value text,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer,
    buckets text
);


ALTER TABLE public.sd_iot_influxdb OWNER TO postgres;

--
-- Name: sd_iot_influxdb_influxdb_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_influxdb_influxdb_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_influxdb_influxdb_id_seq OWNER TO postgres;

--
-- Name: sd_iot_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_line (
    line_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    line_name character varying(255) NOT NULL,
    port character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_line OWNER TO postgres;

--
-- Name: sd_iot_line_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_line_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_line_line_id_seq OWNER TO postgres;

--
-- Name: sd_iot_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_location_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_location_location_id_seq OWNER TO postgres;

--
-- Name: sd_iot_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_location (
    location_id integer DEFAULT nextval('public.sd_iot_location_location_id_seq'::regclass) NOT NULL,
    location_name character varying(255) NOT NULL,
    ipaddress character varying(255) NOT NULL,
    location_detail character varying NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer,
    configdata text
);


ALTER TABLE public.sd_iot_location OWNER TO postgres;

--
-- Name: sd_iot_location_location_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_location_location_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_location_location_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_mqtt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_mqtt (
    mqtt_id integer NOT NULL,
    mqtt_type_id integer,
    sort integer DEFAULT 1 NOT NULL,
    mqtt_name character varying,
    host character varying,
    port integer,
    username character varying,
    password character varying,
    secret character varying,
    expire_in character varying,
    token_value character varying,
    org character varying,
    bucket character varying,
    envavorment character varying,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    location_id integer DEFAULT 1,
    latitude character varying(255),
    longitude character varying(255)
);


ALTER TABLE public.sd_iot_mqtt OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq2 OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq3; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq3
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq3 OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq3; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_mqtt_mqtt_id_seq3 OWNED BY public.sd_iot_mqtt.mqtt_id;


--
-- Name: sd_iot_mqtt_mqtt_id_seq4; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq4
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq4 OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq4; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_mqtt_mqtt_id_seq4 OWNED BY public.sd_iot_mqtt.mqtt_id;


--
-- Name: sd_iot_mqtt_mqtt_id_seq5; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_mqtt_mqtt_id_seq5
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_mqtt_mqtt_id_seq5 OWNER TO postgres;

--
-- Name: sd_iot_mqtt_mqtt_id_seq5; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sd_iot_mqtt_mqtt_id_seq5 OWNED BY public.sd_iot_mqtt.mqtt_id;


--
-- Name: sd_iot_mqtt_mqtt_id_seq6; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.sd_iot_mqtt ALTER COLUMN mqtt_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sd_iot_mqtt_mqtt_id_seq6
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sd_iot_nodered_nodered_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_nodered_nodered_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_nodered_nodered_id_seq OWNER TO postgres;

--
-- Name: sd_iot_nodered; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_nodered (
    nodered_id integer DEFAULT nextval('public.sd_iot_nodered_nodered_id_seq'::regclass) NOT NULL,
    nodered_name character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    port character varying(255) NOT NULL,
    routing text,
    client_id text,
    grant_type character varying(255) NOT NULL,
    scope character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_nodered OWNER TO postgres;

--
-- Name: sd_iot_schedule_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_schedule_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_schedule_schedule_id_seq OWNER TO postgres;

--
-- Name: sd_iot_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_schedule (
    schedule_id integer DEFAULT nextval('public.sd_iot_schedule_schedule_id_seq'::regclass) NOT NULL,
    schedule_name character varying(255) NOT NULL,
    device_id integer,
    start character varying(255) NOT NULL,
    event integer,
    sunday integer,
    monday integer,
    tuesday integer,
    wednesday integer,
    thursday integer,
    friday integer,
    saturday integer,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_schedule OWNER TO postgres;

--
-- Name: sd_iot_schedule_device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_schedule_device (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    schedule_id integer,
    device_id integer
);


ALTER TABLE public.sd_iot_schedule_device OWNER TO postgres;

--
-- Name: sd_iot_sensor_sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_sensor_sensor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_sensor_sensor_id_seq OWNER TO postgres;

--
-- Name: sd_iot_sensor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_sensor (
    sensor_id integer DEFAULT nextval('public.sd_iot_sensor_sensor_id_seq'::regclass) NOT NULL,
    setting_id integer,
    setting_type_id integer,
    sensor_name character varying(50) NOT NULL,
    sn character varying(50) NOT NULL,
    max character varying(50) NOT NULL,
    min character varying(50) NOT NULL,
    hardware_id integer,
    status_high character varying(50) NOT NULL,
    status_warning character varying(50) NOT NULL,
    status_alert character varying(50) NOT NULL,
    model character varying(250) NOT NULL,
    vendor character varying(250) NOT NULL,
    comparevalue character varying(250) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer,
    unit character varying(250) NOT NULL,
    mqtt_id integer,
    oid character varying(250) NOT NULL,
    action_id integer,
    status_alert_id integer,
    mqtt_data_value character varying(250) NOT NULL,
    mqtt_data_control character varying(250) NOT NULL
);


ALTER TABLE public.sd_iot_sensor OWNER TO postgres;

--
-- Name: sd_iot_sensor_sensor_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_sensor_sensor_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_sensor_sensor_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_setting_setting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_setting_setting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_setting_setting_id_seq OWNER TO postgres;

--
-- Name: sd_iot_setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_setting (
    setting_id integer DEFAULT nextval('public.sd_iot_setting_setting_id_seq'::regclass) NOT NULL,
    location_id integer,
    setting_type_id integer,
    setting_name character varying(50) NOT NULL,
    sn character varying(50) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_setting OWNER TO postgres;

--
-- Name: sd_iot_setting_setting_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_setting_setting_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_setting_setting_id_seq1 OWNER TO postgres;

--
-- Name: sd_iot_sms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_sms (
    sms_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sms_name character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    port integer,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    apikey character varying(255) NOT NULL,
    originator character varying(255) NOT NULL,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_sms OWNER TO postgres;

--
-- Name: sd_iot_sms_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_sms_sms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_sms_sms_id_seq OWNER TO postgres;

--
-- Name: sd_iot_telegram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_telegram (
    telegram_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    telegram_name character varying(255) NOT NULL,
    port character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp without time zone DEFAULT now() NOT NULL,
    updateddate timestamp without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_telegram OWNER TO postgres;

--
-- Name: sd_iot_telegram_telegram_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_telegram_telegram_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_telegram_telegram_id_seq OWNER TO postgres;

--
-- Name: sd_iot_token_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_token_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_token_token_id_seq OWNER TO postgres;

--
-- Name: sd_iot_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_token (
    token_id integer DEFAULT nextval('public.sd_iot_token_token_id_seq'::regclass) NOT NULL,
    token_name character varying(255) NOT NULL,
    host integer,
    port character varying(255) NOT NULL,
    token_value text,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_token OWNER TO postgres;

--
-- Name: sd_iot_type_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_type_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_type_type_id_seq OWNER TO postgres;

--
-- Name: sd_iot_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_iot_type (
    type_id integer DEFAULT nextval('public.sd_iot_type_type_id_seq'::regclass) NOT NULL,
    type_name character varying(255) NOT NULL,
    group_id integer,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_iot_type OWNER TO postgres;

--
-- Name: sd_iot_type_type_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_iot_type_type_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_iot_type_type_id_seq1 OWNER TO postgres;

--
-- Name: sd_mqtt_host; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_mqtt_host (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    hostname character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    port character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status integer
);


ALTER TABLE public.sd_mqtt_host OWNER TO postgres;

--
-- Name: sd_schedule_process_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_schedule_process_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    schedule_id integer,
    device_id integer,
    schedule_event_start character varying(255) NOT NULL,
    day character varying(255) NOT NULL,
    doday character varying(255) NOT NULL,
    dotime character varying(255) NOT NULL,
    schedule_event character varying(255) NOT NULL,
    device_status character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    date character varying(50) NOT NULL,
    "time" character varying(20) NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_schedule_process_log OWNER TO postgres;

--
-- Name: sd_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    createddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    updateddate timestamp(6) without time zone DEFAULT now() NOT NULL,
    deletedate date,
    role_id integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    password_temp character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    fullname character varying(255),
    nickname character varying(255),
    idcard character varying(255),
    lastsignindate timestamp(6) without time zone DEFAULT now() NOT NULL,
    status smallint NOT NULL,
    active_status smallint,
    network_id integer,
    remark character varying(255),
    infomation_agree_status smallint,
    gender character varying(255),
    birthday date,
    online_status character varying(255),
    message character varying(255),
    network_type_id integer,
    public_status smallint,
    type_id integer,
    avatarpath character varying(255),
    avatar character varying(255),
    refresh_token text,
    loginfailed smallint,
    public_notification smallint DEFAULT '0'::smallint,
    sms_notification smallint DEFAULT '0'::smallint,
    email_notification smallint DEFAULT '0'::smallint,
    line_notification smallint DEFAULT '0'::smallint,
    mobile_number character varying(255),
    phone_number character varying(255),
    lineid character varying(255)
);


ALTER TABLE public.sd_user OWNER TO postgres;

--
-- Name: sd_user_access_menu_user_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_access_menu_user_access_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_user_access_menu_user_access_id_seq OWNER TO postgres;

--
-- Name: sd_user_access_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_access_menu (
    user_access_id integer DEFAULT nextval('public.sd_user_access_menu_user_access_id_seq'::regclass) NOT NULL,
    user_type_id integer,
    menu_id integer,
    parent_id integer
);


ALTER TABLE public.sd_user_access_menu OWNER TO postgres;

--
-- Name: sd_user_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_user_file_id_seq OWNER TO postgres;

--
-- Name: sd_user_file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_file (
    id integer DEFAULT nextval('public.sd_user_file_id_seq'::regclass) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_type character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    file_type_id integer NOT NULL,
    uid character varying(255),
    file_date timestamp(6) without time zone DEFAULT now() NOT NULL,
    status smallint NOT NULL
);


ALTER TABLE public.sd_user_file OWNER TO postgres;

--
-- Name: sd_user_file_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_file_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_user_file_id_seq1 OWNER TO postgres;

--
-- Name: sd_user_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_user_log_id_seq OWNER TO postgres;

--
-- Name: sd_user_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_log (
    id integer DEFAULT nextval('public.sd_user_log_id_seq'::regclass) NOT NULL,
    log_type_id integer NOT NULL,
    uid uuid NOT NULL,
    name character varying(255) NOT NULL,
    detail character varying(255) NOT NULL,
    select_status integer,
    insert_status integer,
    update_status integer,
    delete_status integer,
    status integer,
    "create" timestamp(6) without time zone DEFAULT now() NOT NULL,
    update timestamp(6) without time zone DEFAULT now() NOT NULL,
    lang character varying(50)
);


ALTER TABLE public.sd_user_log OWNER TO postgres;

--
-- Name: sd_user_log_type_log_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_log_type_log_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.sd_user_log_type_log_type_id_seq OWNER TO postgres;

--
-- Name: sd_user_log_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_log_type (
    log_type_id integer DEFAULT nextval('public.sd_user_log_type_log_type_id_seq'::regclass) NOT NULL,
    type_name character varying(255) NOT NULL,
    type_detail character varying(255) NOT NULL,
    status integer,
    "create" timestamp(6) without time zone DEFAULT now() NOT NULL,
    update timestamp(6) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sd_user_log_type OWNER TO postgres;

--
-- Name: sd_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sd_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sd_user_role_id_seq OWNER TO postgres;

--
-- Name: sd_user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_role (
    id integer DEFAULT nextval('public.sd_user_role_id_seq'::regclass) NOT NULL,
    role_id integer NOT NULL,
    title character varying(50),
    createddate timestamp(6) without time zone DEFAULT now(),
    updateddate timestamp(6) without time zone DEFAULT now(),
    create_by integer NOT NULL,
    lastupdate_by integer NOT NULL,
    status smallint NOT NULL,
    type_id integer NOT NULL,
    lang character varying(255) NOT NULL
);


ALTER TABLE public.sd_user_role OWNER TO postgres;

--
-- Name: sd_user_roles_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_roles_access (
    "create" timestamp(6) without time zone DEFAULT now() NOT NULL,
    update timestamp(6) without time zone DEFAULT now() NOT NULL,
    role_id integer NOT NULL,
    role_type_id integer NOT NULL
);


ALTER TABLE public.sd_user_roles_access OWNER TO postgres;

--
-- Name: sd_user_roles_permision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sd_user_roles_permision (
    role_type_id integer NOT NULL,
    name character varying(255) NOT NULL,
    detail text,
    created timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated timestamp(6) without time zone DEFAULT now(),
    insert integer,
    update integer,
    delete integer,
    "select" integer,
    log integer,
    config integer,
    truncate integer
);


ALTER TABLE public.sd_user_roles_permision OWNER TO postgres;

--
-- Name: COLUMN sd_user_roles_permision.created; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.created IS 'เพิ่มเมื่อ';


--
-- Name: COLUMN sd_user_roles_permision.updated; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.updated IS 'แก้ไขเมื่อ';


--
-- Name: COLUMN sd_user_roles_permision.insert; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.insert IS 'เพิ่มข้อมูล';


--
-- Name: COLUMN sd_user_roles_permision.update; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.update IS 'แก้ไขข้อมูล';


--
-- Name: COLUMN sd_user_roles_permision.delete; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.delete IS 'ลบข้อมูล';


--
-- Name: COLUMN sd_user_roles_permision."select"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision."select" IS 'ดูข้อมูล';


--
-- Name: COLUMN sd_user_roles_permision.log; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.log IS 'จัดการประวัติ';


--
-- Name: COLUMN sd_user_roles_permision.config; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.config IS 'ตั้งค่าระบบ';


--
-- Name: COLUMN sd_user_roles_permision.truncate; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sd_user_roles_permision.truncate IS 'ล้างข้อมูล';


--
-- Data for Name: sd_admin_access_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_admin_access_menu (admin_access_id, admin_type_id, admin_menu_id) FROM stdin;
\.


--
-- Data for Name: sd_alarm_process_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
9b1f77d8-b069-4b31-8bfc-a2ea46eb4f9b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	19:28	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:36	2025-08-07 19:28:16
0da102e5-2b63-48d7-8c2d-71636906ecf9	70	8	1	0	1	30	25	32	25	1	0	0	0	0	0	2025-08-07	19:28	33.1	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 18:26:05	2025-08-07 19:28:16
c0a487f7-dea9-419c-bf8f-5e25deeb9303	70	8	1	0	1	30	25	32	25	1	0	0	0	0	0	2025-08-07	19:28	33.1	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:58:21	2025-08-07 19:28:16
1146a652-8886-452d-8432-cafbd0c5a564	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:33	31.9	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	2025-08-08 19:33:19	2025-08-08 19:33:19
c1f41275-d6cd-4bec-acc2-93bcac3c2fe4	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	20:53	32.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.1	2025-08-08 20:43:14	2025-08-08 20:53:14
29110db3-92f9-4b24-9490-d59aa9dec5d8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:33	31.9	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.4	2025-08-08 13:56:49	2025-08-08 19:33:19
65df628e-dcfd-43d2-96ec-0447fd925ff0	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:33	31.9	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	2025-08-08 18:38:24	2025-08-08 19:33:19
477ef237-d9a9-4c20-88bd-903edec53b8c	70	8	1	0	1	30	25	32	25	1	0	0	0	0	0	2025-08-08	17:58	32.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:24	2025-08-08 17:58:20
85aa853c-fa04-4265-9a37-af0af41a5e0e	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-09	11:50	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:25	2025-08-09 11:50:25
369089cd-80ce-4208-b0ee-f4b345b2e880	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:38	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:18:58	2025-08-10 23:39:00
15a03cd6-7c53-483b-95f1-352bf409ac8b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:38	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:23:53	2025-08-10 23:39:00
45da092d-1f59-4c25-b852-f00e7f6f1ff3	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	18:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-11 16:53:58	2025-08-11 18:08:53
4d8483b7-f26b-435b-b123-529b044334d3	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	18:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-11 17:58:58	2025-08-11 18:08:53
\.


--
-- Data for Name: sd_alarm_process_log_email; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log_email (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
249886d3-af37-47ec-b748-798ba4f4ab78	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-07	18:58	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:58:25	2025-08-07 18:58:25
2d0fa50d-fce2-4f41-b3e1-b3421cc70939	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 19:08:26	2025-08-07 19:08:26
f0d5f5e2-63b0-420e-9172-74baa1f0cd9c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:48	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:19	2025-08-08 17:48:19
72fe7b42-c9e8-4163-b03d-93a60ac10c38	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-08	17:48	32.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:29	2025-08-08 17:48:29
9abb0bfa-a43c-4fc8-80d6-b2ce71106c04	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-09	11:50	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:36	2025-08-09 11:50:36
5c30c0e6-021c-40c0-8ae6-f41534ee5c4f	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	14:30	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:12	2025-08-09 14:30:12
bee35331-1b53-4837-9b4f-64a73f4ed5cf	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:46	2025-08-09 15:47:46
708c770b-4208-4855-b945-bc68836f26fa	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	22:33	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:54	2025-08-10 22:33:54
924f1164-525f-48d0-82a7-82af57e1c862	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:38	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:00	2025-08-10 23:39:00
4c30de77-9c3b-426c-8542-0a483306e8d8	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	00:03	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-11 00:04:03	2025-08-11 00:04:03
b856fbcf-9245-47e7-a828-01bef92119dc	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	01:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:04	2025-08-11 01:17:04
\.


--
-- Data for Name: sd_alarm_process_log_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log_line (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
0cc0d56f-4384-4999-9f5d-da18f07e2421	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:28	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:41	2025-08-07 19:28:16
a1484306-d98c-4c60-9330-231c12db4860	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:58	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:58:19
07d9f1e1-0fad-4d05-a85a-7c1b877b8f0c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 16:33:18
b27995df-7152-4921-8802-5c1a70d076a7	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 16:33:18
7026e393-a78c-4ea8-bf62-3f4bf78253ef	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 02:16:46
9b33a384-c059-47fb-82e8-7137afa7d93e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 23:39:08
67c50a49-0497-4486-ac62-109ed77c6e70	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:06	2025-08-10 23:39:08
bed0e55b-3846-4a3d-af5c-127691370ed9	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 02:16:46
\.


--
-- Data for Name: sd_alarm_process_log_sms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log_sms (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
2ac5a65b-daed-4030-9433-610856e87ed4	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:28	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:41	2025-08-07 19:28:16
d6dd3223-3e8e-44f3-a824-75ee24c0bb1d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:58	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:58:19
64afe331-15cc-4dc6-b04b-2b40b716c39b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 16:33:18
9f529d18-892a-45f5-91db-f7addeaa696f	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 16:33:18
e069ed2a-3324-410b-9e8a-525f40b9ba8b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 02:16:46
c92702a7-4ad1-46dd-8dd9-79c8058619d9	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 23:39:14
c1c074cc-ffb1-4708-9010-ee9637944245	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:13	2025-08-10 23:39:14
1cb42bd0-c896-411f-9d9b-8b5bab2948f5	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 02:16:46
\.


--
-- Data for Name: sd_alarm_process_log_telegram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log_telegram (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
1beb8f03-1deb-44f7-8023-78f840d45802	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:58	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:58:20
983b45d6-9683-43ad-8754-8e5d084c3db4	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 02:16:46
ad22922a-6f77-4109-96f3-e4ff95495859	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	02:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 02:16:46
2917053a-cab4-486f-9658-6fb71c24bfe5	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 23:39:15
54de789d-3ce4-4e08-9ec6-e90417a8e1c9	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:15	2025-08-10 23:39:15
b50ba1ae-af35-49b2-b9d6-fb37d3006198	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 16:33:18
f00a3f4c-39b9-4b64-9e4a-4d962a3317b6	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	16:33	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 16:33:18
\.


--
-- Data for Name: sd_alarm_process_log_temp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_alarm_process_log_temp (id, alarm_action_id, device_id, type_id, event, alarm_type, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, status, date, "time", data, data_alarm, alarm_status, subject, content, createddate, updateddate) FROM stdin;
4faab9ce-387b-4e45-9efb-e91ac1b1d2fc	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	10:53	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-07 10:53:53	2025-08-07 10:53:53
f8ba9b94-39f1-47e3-a01f-0b0e4eac970b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	10:53	33.7	32	1	 Alarm Sensor ON Warning Device Sensor: Temperature value: 33.7	 Alarm Sensor ON Warning  Device Sensor: Temperature value: 33.7	2025-08-07 10:54:03	2025-08-07 10:54:03
4893f1e0-49f6-4131-ac36-05e4c1f22194	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	11:55	32.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.9	2025-08-07 11:55:18	2025-08-07 11:55:18
f59ed651-722a-4a14-b490-ca3c9aee4c2f	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-07	11:55	32.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.9	2025-08-07 11:55:34	2025-08-07 11:55:34
1c61aadc-1053-40bc-9243-6000c9cf27ba	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	12:33	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 12:33:53	2025-08-07 12:33:53
c190d9c2-d445-4f04-998c-3016b9cc78e0	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	12:57	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 12:57:48	2025-08-07 12:57:48
d059a190-986e-4fcc-9261-8c0d5b133aa3	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	13:00	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 13:00:28	2025-08-07 13:00:28
aecd3a78-b010-4b46-929b-df1d59490665	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	13:00	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 13:00:41	2025-08-07 13:00:41
d8d56764-3c81-4312-b0d3-78df3be0b08e	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	14:17	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 14:17:48	2025-08-07 14:17:48
faa56d6d-4a54-437d-b5e4-8be2b83a13a8	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	14:17	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 14:17:56	2025-08-07 14:17:56
809aca92-67d1-498e-9edc-a2885543bda8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	15:39	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 15:39:58	2025-08-07 15:39:58
e644f223-96fb-48b5-823a-e417fb03822e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	15:40	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 15:40:06	2025-08-07 15:40:06
6233ea87-f9ee-48f9-87a3-2bc8986687f0	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	16:15	33.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:15:42	2025-08-07 16:15:42
908dc8a6-f025-4e0c-91b3-12f66be4957f	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	16:44	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:45:03	2025-08-07 16:45:03
c342884b-d5b0-4d02-9de5-70aadd26f23b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	17:48	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 17:48:19	2025-08-07 17:48:19
433beaca-d93a-4ede-8a27-558b4b68d288	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	17:48	33.3	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 17:48:23	2025-08-07 17:48:23
047c5b3b-fe46-4456-ba35-ff7585a96070	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	18:00	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:00:43	2025-08-07 18:00:43
f14e8240-0e5c-453d-b979-ea46a3d4c5e1	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-07	18:16	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:16:59	2025-08-07 18:16:59
52bae81e-b5d9-4270-89cc-2f58589c86c4	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	18:23	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:23:18	2025-08-07 18:23:18
94c4fb64-838f-4ba2-a9f1-1b6ee21300b4	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	18:36	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:36:28	2025-08-07 18:36:28
afad8de2-3822-4c45-9b51-8c1e8a5edf78	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	18:36	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:36:36	2025-08-07 18:36:36
c55dee97-9ee1-46b1-a20a-3bf7105baaf4	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	18:48	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:48:18	2025-08-07 18:48:18
beb9e30a-81a0-418f-80eb-385677e926ff	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-07	18:48	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:48:18	2025-08-07 18:48:18
1c9ced96-7ac5-4d59-b961-35fff6426a1b	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	11:00	33.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 11:00:18	2025-08-07 11:00:18
53867996-3a03-4145-a38b-aa398105ad7c	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-07	11:00	33.4	30	1	 Alarm Sensor  OFF Warning Device Sensor: Temperature value: 33.4	 Alarm Sensor  OFF Warning  Device Sensor: Temperature value: 33.4	2025-08-07 11:00:29	2025-08-07 11:00:29
ca22471d-a476-4d20-9c48-8df0905e41da	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	12:02	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 12:02:48	2025-08-07 12:02:48
ec465c55-7fc4-4d74-ad34-ee5d08e82398	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	12:02	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 12:02:58	2025-08-07 12:02:58
a0978138-b2d8-4c69-99c8-e51ba21b7e54	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	13:32	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 13:32:48	2025-08-07 13:32:48
3602d12b-d058-4bb1-a573-98adaa8be60e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	13:32	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 13:32:58	2025-08-07 13:32:58
e14a6837-c76e-41f0-820d-5aaccbe7dfee	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	14:52	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-07 14:52:48	2025-08-07 14:52:48
7597335e-ac27-4012-8c18-a9162498bc08	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	14:52	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-07 14:52:57	2025-08-07 14:52:57
8f764192-a12d-4c54-8ce8-c847006d6dce	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	16:11	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:11:58	2025-08-07 16:11:58
5f117b97-f8e5-42b7-bc2c-7f1c7a01ffef	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-07	16:15	33.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:16:08	2025-08-07 16:16:08
6cc02433-27a7-41c6-b930-c2f020871f88	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	16:54	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:55:03	2025-08-07 16:55:03
0a9c0743-7f46-4ad6-83b8-08d110503e4b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	17:53	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-07 17:53:08	2025-08-07 17:53:08
845a7233-a014-43d1-af21-dc2ce32a4d8d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	18:02	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:02:28	2025-08-07 18:02:28
1edba7be-67c4-4992-ac0b-0891f587d04b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	18:02	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:02:28	2025-08-07 18:02:28
6850dabe-4b4b-40a0-bf6d-2edd1260ee2f	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	18:25	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 18:25:58	2025-08-07 18:25:58
14a3c5ce-a1ac-4940-895c-5321b56daaae	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	18:25	33.1	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 18:26:05	2025-08-07 18:26:05
45126639-3efb-43ed-91fa-742060c19c5d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	18:36	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:36:34	2025-08-07 18:36:34
edec7573-835f-4856-95b4-7a153735e6e7	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	11:27	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-07 11:27:48	2025-08-07 11:27:48
90dd24f8-8649-4443-8934-5ce9e5b66e13	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	11:27	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-07 11:27:53	2025-08-07 11:27:53
ae32038c-8518-44de-bd62-090d6346ccb0	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	14:07	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 14:07:48	2025-08-07 14:07:48
fb894d91-4d95-48d7-a120-e1e6e461e466	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	14:07	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 14:07:56	2025-08-07 14:07:56
551a8a11-11f8-4f43-90fe-9342ca77aa47	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	15:27	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 15:27:48	2025-08-07 15:27:48
e06d7b1a-d6c8-4c3e-93cd-a2de8be80a48	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	15:27	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 15:27:56	2025-08-07 15:27:56
8f4060c8-243c-42b6-b0d4-5a35e5f51de8	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	16:12	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-07 16:12:27	2025-08-07 16:12:27
3ea3336c-2d49-4b58-8cdb-197512820506	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	16:24	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-07 16:25:03	2025-08-07 16:25:03
83da62bd-bbc6-4089-a6e0-bf9700f7d6a2	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-07	16:25	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-07 16:25:11	2025-08-07 16:25:11
2891609c-5c8b-4a35-8fe7-efa7d2af50bd	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	17:26	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 17:26:08	2025-08-07 17:26:08
a39fb429-e0b3-4642-b377-311654d81413	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	17:58	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 17:58:13	2025-08-07 17:58:13
80aed015-a80d-4618-8a26-6259a9e75d06	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	18:14	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:14:14	2025-08-07 18:14:14
8d2c76d9-fe01-44a5-be53-13d3e7966833	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	18:58	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:58:16	2025-08-07 18:58:16
26fdc388-0da3-415b-8852-b9b0acd2d42f	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-07	18:58	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:58:21	2025-08-07 18:58:21
7e3eebf8-187d-4908-b19a-bba978e4a1c7	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-07	18:58	33.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 18:58:25	2025-08-07 18:58:25
43b8dcc3-aff5-45c8-95b7-1f5740cf7e9e	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	19:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 19:08:21	2025-08-07 19:08:21
b05a1f23-5da2-45a8-8691-338dd2ead895	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 19:08:26	2025-08-07 19:08:26
4e459c33-a4b6-4dff-9f43-26750b09e796	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	19:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 19:08:26	2025-08-07 19:08:26
e28e89a2-cfd6-4240-91a4-a4d6649f1009	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	19:08	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-07 19:08:26	2025-08-07 19:08:26
5e3f9579-af88-439b-8fae-f9a59b95f5d1	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-07	19:18	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:36	2025-08-07 19:18:36
e61bcbd1-ce60-456b-a066-f64a0083af3d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:18	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:41	2025-08-07 19:18:41
d8fd7b4d-131c-4617-afc7-fae0ad4fefd2	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-07	19:18	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:18:41	2025-08-07 19:18:41
78a2dee6-5d70-488a-b7bd-fbfdc907529c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-07	19:23	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-07 19:23:16	2025-08-07 19:23:16
25655b49-a7ca-482b-9e15-f128a16dd8e8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	09:43	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:43:57	2025-08-08 09:43:57
cd4e5924-8d87-45a0-aeb5-39bb4d5d0464	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	09:44	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:02	2025-08-08 09:44:02
b32aa343-7409-4b5e-81b4-ceddf300f34f	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	09:44	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:02	2025-08-08 09:44:02
1f42f8b2-384b-4e9f-b2fa-e9f5a652d9fb	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	09:44	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:02	2025-08-08 09:44:02
bb0ff4d6-0999-405a-8be0-482ea2882361	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	09:44	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:02	2025-08-08 09:44:02
5c63278b-230a-43aa-9ba4-238208832a28	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	09:44	36.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:07	2025-08-08 09:44:07
f6e12f6d-6a6f-4bd5-b298-50789fd73a55	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-08	09:44	36.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 09:44:12	2025-08-08 09:44:12
35756fa9-0fe9-4471-8110-b17f3ffc8eaf	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	10:23	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:23:55	2025-08-08 10:23:55
b8f656db-b3de-4996-ba6d-e5e00e62f14b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:24	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:00	2025-08-08 10:24:00
338bb433-6abb-4769-91da-8831b22f2e82	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:24	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:00	2025-08-08 10:24:00
12966c9f-5d2c-49df-a0fd-ea1734b38c6d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:24	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:00	2025-08-08 10:24:00
6785adf7-a21b-43b4-a365-cb0d2f466ceb	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:24	36.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:00	2025-08-08 10:24:00
4a795295-212e-4d3e-b888-d7a343838cd3	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	10:24	36.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:05	2025-08-08 10:24:05
bc327785-c1be-4af0-9ae1-38274d29d2fd	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-08	10:24	36.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 36.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 36.9	2025-08-08 10:24:10	2025-08-08 10:24:10
c87dcf78-44cd-43c5-aef0-e4f9534c57f8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	10:58	33.5	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.5	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.5	2025-08-08 10:58:55	2025-08-08 10:58:55
0c18b45c-9dcb-4783-b8d4-3cfbc8aa5f1f	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:59	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:00	2025-08-08 10:59:00
501800c4-5dbe-4d9f-bb44-e3f62f8cad55	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:59	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:00	2025-08-08 10:59:00
08b38f66-80f7-4818-a2cb-4823bc661fb5	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:59	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:00	2025-08-08 10:59:00
a210dd71-229d-405e-b28b-fc80a41b960d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	10:59	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:00	2025-08-08 10:59:00
6b5f4c37-5277-4205-926a-8c9d110fd428	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	10:59	33.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:05	2025-08-08 10:59:05
311b5d59-dc4e-4095-bec5-eb8053f85759	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-08	10:59	33.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.4	2025-08-08 10:59:10	2025-08-08 10:59:10
e88b3021-6f62-4552-88a8-409447c26fdd	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	11:18	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:18:53	2025-08-08 11:18:53
076fdb4d-0463-46db-9cf1-553a3d77e91c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	11:18	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:18:59	2025-08-08 11:18:59
65a918bb-4713-4823-9038-eab604d42d3b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	11:19	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:19:00	2025-08-08 11:19:00
4588ed2a-0a6b-44ab-9b80-a2b8dc57b7c5	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	11:19	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:19:01	2025-08-08 11:19:01
37c2c8e1-ab7e-4669-8820-f237e5ad4c1e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	11:19	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:19:01	2025-08-08 11:19:01
433499ea-5e7c-48c9-a74b-734a91ee6a19	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	11:19	32.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:19:03	2025-08-08 11:19:03
70b21912-cc45-41a1-8fb0-cc24ecf1a215	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-08	11:19	32.9	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 11:19:21	2025-08-08 11:19:21
3a206e71-81cd-4812-a13f-c21d63f7c186	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	12:51	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:49	2025-08-08 12:51:49
ad6f1a1a-ae55-4ad3-b5ec-7db0ef68b8ff	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	12:51	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:54	2025-08-08 12:51:54
9cb09fe9-71c7-4672-a8e5-eac6eda9b2b2	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	12:51	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:54	2025-08-08 12:51:54
50fe77d2-fe20-427b-b871-2d0a56456dd3	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	12:51	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:54	2025-08-08 12:51:54
892f273d-095b-436b-ab9d-cdd321e3127b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	12:51	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:54	2025-08-08 12:51:54
1cfb114e-1201-428c-9a30-6892ccd2485f	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	12:51	32.7	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:51:59	2025-08-08 12:51:59
c09b7711-e49f-4862-bf72-bb89c79fabcf	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-08	12:52	32.7	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 12:52:04	2025-08-08 12:52:04
a7b4b392-a458-4a25-ad73-01790115c70f	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	13:31	33.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-08 13:31:49	2025-08-08 13:31:49
17eaf7cf-105d-4a10-b316-038e49f4f318	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	13:46	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-08 13:46:49	2025-08-08 13:46:49
0deb03eb-0dcc-40f8-9e97-570f8e009307	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	13:56	31.4	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.4	2025-08-08 13:56:49	2025-08-08 13:56:49
af12e8ce-d8a7-499a-b628-d5c369a72765	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	14:21	32.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.6	2025-08-08 14:21:44	2025-08-08 14:21:44
bf9957df-2e36-437e-b74d-c6bc9acb8da3	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	14:56	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 14:56:44	2025-08-08 14:56:44
1bd9766c-e9ac-4491-81c6-c593ac3c7df5	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	15:06	32.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.9	2025-08-08 15:06:44	2025-08-08 15:06:44
ea1bcb30-12c7-4069-8dc5-623f613a0654	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	17:38	32.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:24	2025-08-08 17:38:24
b95b411c-bb4a-49f1-98b2-ed06fa666089	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	17:38	32.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:29	2025-08-08 17:38:29
212e9317-41ea-4189-aaff-9757e81fe20d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	17:38	32.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:29	2025-08-08 17:38:29
fbebbc61-6401-4188-ab15-a347388d1e19	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	17:38	32.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:30	2025-08-08 17:38:30
db595558-9a9a-4ae5-883b-bfae7b962a41	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-08	17:38	32.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:30	2025-08-08 17:38:30
0d4e0206-fb74-45d2-b7b2-9167b7087a4c	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	17:38	32.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:34	2025-08-08 17:38:34
366676c7-275e-4bdc-9523-27dda8edb78f	70	8	1	0	1	30	25	32	25	1	0	0	0	0	1	2025-08-08	17:38	32.4	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.4	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.4	2025-08-08 17:38:39	2025-08-08 17:38:39
9d9adc5e-5a6d-4273-ba0a-fae1117bcd94	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:48	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:19	2025-08-08 17:48:19
65992666-18a6-4b14-b860-0885c1091b6b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:48	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:48:20
b2f9e118-9c7d-4356-87ee-75c61cb3641e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:48	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:48:20
9d57e3d0-9484-4a97-9a13-0d287badeeb0	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-08	17:48	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:20	2025-08-08 17:48:20
a77ca6d6-0495-429b-ade5-cedb0ee31ecf	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-08	17:48	32.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:24	2025-08-08 17:48:24
d670fce7-9d15-4103-9e55-dd3c2fd6cc93	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-08	17:48	32.2	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 17:48:29	2025-08-08 17:48:29
ee1a261e-f7af-4140-831e-bcd017fa064b	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	18:38	31.9	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	2025-08-08 18:38:24	2025-08-08 18:38:24
c4d74926-3fc0-46d0-b0a5-767c8c99d3e7	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:08	32.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.0	2025-08-08 19:08:19	2025-08-08 19:08:19
f398cc6f-4424-4c5d-9ae2-f6a917bfaa4e	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:18	32.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.0	2025-08-08 19:18:19	2025-08-08 19:18:19
c8e3efe0-ffe4-432d-a283-652c17ce30a8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:33	31.9	33	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Recovery Warning Device Sensor: Temperature value: 31.9	2025-08-08 19:33:19	2025-08-08 19:33:19
19154ee8-a1a8-4784-9893-d836517cb6f1	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	19:58	32.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.2	2025-08-08 19:58:19	2025-08-08 19:58:19
7625edc6-c62d-4c0b-97bc-2be7ecec86bf	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	20:33	32.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.1	2025-08-08 20:33:19	2025-08-08 20:33:19
4f9d6494-0f64-460b-932f-a3d1bb82a084	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-08	20:43	32.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.1	2025-08-08 20:43:14	2025-08-08 20:43:14
70772f33-70f5-41bb-9412-c214b6d1c5bc	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	11:24	34.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.4	2025-08-09 11:24:25	2025-08-09 11:24:25
9b152a32-b07d-41e2-b2aa-e2d7a6a9ec30	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	11:50	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:17	2025-08-09 11:50:17
a1b172ba-efb2-43e2-907e-6c3f8153ab7b	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	11:50	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:20	2025-08-09 11:50:20
f43eda20-faf8-4638-9241-2a60ff7978fa	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	11:50	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:20	2025-08-09 11:50:20
1b1cbced-2325-4d2f-b12a-5fb097f97a81	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	11:50	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:20	2025-08-09 11:50:20
3131f80b-980d-44f6-8951-a6a4302aa796	70	8	1	0	1	30	25	32	25	0	0	0	0	1	0	2025-08-09	11:50	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:25	2025-08-09 11:50:25
236afafe-16a2-4b88-acc3-87fd324e5b89	70	8	1	0	1	30	25	32	25	1	0	0	0	0	\N	2025-08-09	11:50	33.6	30	1	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor  OFF  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 11:50:36	2025-08-09 11:50:36
263b90e0-f7d5-41bd-a47e-f03c896d4877	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	12:00	33.9	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.9	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.9	2025-08-09 12:00:10	2025-08-09 12:00:10
aae067c8-ba8d-4387-82b0-92b7e83460f4	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	12:25	33.5	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.5	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.5	2025-08-09 12:25:13	2025-08-09 12:25:13
4c556c7b-d7f6-4b38-8f15-d5bce7f4814a	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	12:25	33.5	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.5	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.5	2025-08-09 12:25:15	2025-08-09 12:25:15
7256fd38-fc93-4c85-bcef-d5be0e906846	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	12:25	33.5	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.5	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.5	2025-08-09 12:25:15	2025-08-09 12:25:15
9f3c8a95-9eae-428e-a3e8-555e6873aef7	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	12:25	33.5	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.5	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.5	2025-08-09 12:25:15	2025-08-09 12:25:15
9e761ddd-6193-406b-832e-3a1b6c1c720c	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	12:35	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 12:35:10	2025-08-09 12:35:10
22cb7bc1-9654-443c-9cf5-4ec980024ae5	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	12:45	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 12:45:10	2025-08-09 12:45:10
8ce6d1ad-42be-44d8-a45c-4936e71fcb9d	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:00	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:00:13	2025-08-09 13:00:13
b46a675b-f6f2-4b85-9345-d9f6cf3afa66	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:00	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:00:15	2025-08-09 13:00:15
e709500e-4463-4ff9-b4e8-bd844bca9960	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:00	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:00:15	2025-08-09 13:00:15
3f0de97a-dcb8-4a4d-b432-ac0ee76bf8a1	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:00	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:00:15	2025-08-09 13:00:15
f633aba3-961f-4456-b262-4f948660352c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	13:10	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:10:11	2025-08-09 13:10:11
d8981118-ffcb-4559-8854-77fe2561fdfe	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	13:10	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:10:15	2025-08-09 13:10:15
0d1634d3-164d-4ce3-b2d4-7a31870ea5d3	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	13:10	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:10:15	2025-08-09 13:10:15
aa8996a8-aae6-4c62-97c7-a0c06dd554ee	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	13:10	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:10:15	2025-08-09 13:10:15
8aeb599b-797f-4a7d-981c-ca5623a28bfd	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	13:20	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-09 13:20:10	2025-08-09 13:20:10
fc40578e-5cbb-4310-923d-4197593089de	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:45	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 13:45:12	2025-08-09 13:45:12
254ede92-af28-4a29-8850-6aa3d5c14651	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:45	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 13:45:15	2025-08-09 13:45:15
3e263bed-e56e-491b-b084-06ea806c3b9a	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:45	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 13:45:15	2025-08-09 13:45:15
fecbe09a-cca6-4957-8096-ae3278552784	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	13:45	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 13:45:15	2025-08-09 13:45:15
b2a14bf8-3b89-42d5-9ee2-45714a1c78e2	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	13:55	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-09 13:55:10	2025-08-09 13:55:10
e807fc83-8111-4f17-942c-688213bc3d63	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	14:05	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:05:10	2025-08-09 14:05:10
e40da276-f159-43b3-ba6d-0c64a37e6828	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	14:20	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:20:13	2025-08-09 14:20:13
dc04251a-417d-4b6b-a362-af6f53938a0e	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	14:20	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:20:15	2025-08-09 14:20:15
aa2a331b-c265-44d6-a805-4b4e048dd7f6	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	14:20	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:20:15	2025-08-09 14:20:15
5cefbd55-390f-4998-98fe-32507f08b79a	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	14:20	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:20:15	2025-08-09 14:20:15
eee1819c-cea5-4d41-bcd0-fa76ffe6b473	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	14:30	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:12	2025-08-09 14:30:12
399708a3-6e54-4f67-9cb9-e46adc1ee922	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	14:30	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 14:30:15
4c2346c7-29a6-4c5a-8305-a386c581d391	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	14:30	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 14:30:15
aefd0066-9954-465c-a368-30552017b2e6	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-09	14:30	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:30:15	2025-08-09 14:30:15
421adbc3-f705-435a-ab03-b654eddbf44f	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	14:40	33.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.7	2025-08-09 14:40:10	2025-08-09 14:40:10
8c51e9c6-58d7-4799-b7ba-de17834b1644	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:35	2025-08-09 15:47:35
c4ef0fac-0557-49a8-a5d5-040a20824729	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:46	2025-08-09 15:47:46
6a9dfb41-5d66-4a15-8c80-9409baec79f1	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 15:47:50
686fcc00-30b4-4dea-8474-a5a017cc2414	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 15:47:50
62b34b57-889a-405e-a5c8-10e8a7127292	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-09	15:47	34.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 34.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 34.2	2025-08-09 15:47:50	2025-08-09 15:47:50
c992d861-3339-47e4-bbbb-950b491838d7	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-10	22:18	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:18:58	2025-08-10 22:18:58
59747d33-e5ed-4954-80d6-cb1849d5f318	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	22:33	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:54	2025-08-10 22:33:54
bfbf01e1-1cba-4bd0-bd9d-06150cccc0a6	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	22:33	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 22:33:58
31d3ba7a-4de2-4728-ac4e-4e072a354c27	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	22:33	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 22:33:58
b0d826d2-8c6a-42b2-9874-7c07c9d35b18	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-10	22:33	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-10 22:33:58	2025-08-10 22:33:58
28412a70-2a58-42d8-aa8a-9a4d9fbb8952	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-10	23:23	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:23:53	2025-08-10 23:23:53
795a2659-44b8-4448-a6a9-f92cdefbb271	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:38	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:00	2025-08-10 23:39:00
0e1de6d9-72b4-4862-af10-9d5899abc553	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:06	2025-08-10 23:39:06
3f164f5c-d200-48f3-8a71-072fb64b6c4c	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:13	2025-08-10 23:39:13
868829e5-d4f4-44ee-a2ee-f8283f308a0a	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-10	23:39	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-10 23:39:15	2025-08-10 23:39:15
a080ff4d-c9a4-4600-b61a-ce807a888981	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	00:03	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-11 00:03:53	2025-08-11 00:03:53
40b2f04a-34d7-4a83-894a-edfc2489c875	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	00:03	33.1	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.1	2025-08-11 00:04:03	2025-08-11 00:04:03
6b8a3e26-aacc-4622-acfc-a8bd037a8ea9	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	00:04	33.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 00:04:08
c2c3b0ef-cff9-4961-b642-f40ffb720489	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	00:04	33.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 00:04:08
8eac44cb-2d5c-4652-b470-309d1a2052ba	1	8	1	1	1	32	33	38	33	1	0	0	0	0	\N	2025-08-11	00:04	33.0	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.0	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.0	2025-08-11 00:04:08	2025-08-11 00:04:08
2a3ef573-a011-43b5-a9e8-18748bbf1f7e	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	01:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:16:51	2025-08-11 01:16:51
3cac54f8-0c0b-4044-a343-85f0413d7629	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	01:16	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:04	2025-08-11 01:17:04
da8ce0cd-a68d-44d1-ab03-f8c912391c92	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	01:17	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 01:17:06
10aef527-09c5-4022-a09b-2f5f9aa42a24	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	01:17	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 01:17:06
d3d4adfc-c8d6-4cb1-83bb-43a8f9e7c622	1	8	1	1	1	32	33	38	33	1	0	0	0	0	1	2025-08-11	01:17	32.8	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.8	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.8	2025-08-11 01:17:06	2025-08-11 01:17:06
55bef4d1-3281-4cf1-b790-ccbe667f8876	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	02:24	32.7	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.7	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.7	2025-08-11 02:24:41	2025-08-11 02:24:41
378650fa-6b06-405c-aceb-e7652ab845d3	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	02:34	32.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 32.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 32.6	2025-08-11 02:34:41	2025-08-11 02:34:41
9e5aa710-fbbc-40cd-9e9e-ecc0bdaa0cc2	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	13:18	33.3	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.3	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.3	2025-08-11 13:18:38	2025-08-11 13:18:38
197a9db0-203b-46c0-ba54-9cc293532f9d	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	14:23	33.6	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.6	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.6	2025-08-11 14:23:58	2025-08-11 14:23:58
df012d9e-b6fa-41b3-b358-1b043fb51054	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	14:33	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-11 14:33:58	2025-08-11 14:33:58
a5bcd886-612f-4db5-9605-977377eabc0f	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	15:38	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-11 15:38:58	2025-08-11 15:38:58
92698fb0-a6f9-4929-b8e6-0ee28893441c	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	16:43	33.4	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.4	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.4	2025-08-11 16:43:58	2025-08-11 16:43:58
66c8d4b3-a66d-48cf-bdfa-11fd6ffe2106	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	16:53	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-11 16:53:58	2025-08-11 16:53:58
fea72d5e-552d-431a-9d28-fe3b36e692e8	1	8	1	1	1	32	33	38	33	0	0	0	0	1	1	2025-08-11	17:58	33.2	32	1	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning Device Sensor: Temperature value: 33.2	อาคาร 1 ชั้น 1  Alarm Sensor ON  Warning  Device Sensor: Temperature value: 33.2	2025-08-11 17:58:58	2025-08-11 17:58:58
\.


--
-- Data for Name: sd_device_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_device_log (id, type_id, sensor_id, name, data, status, lang, "create") FROM stdin;
\.


--
-- Data for Name: sd_iot_alarm_device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_alarm_device (id, alarm_action_id, device_id) FROM stdin;
979dc81b-fe2f-412e-859a-3dea5b5725b6	1	8
74150d6f-575d-47ea-974d-44e18a58b1cd	71	10
22357eab-42d5-4eba-83e6-d4634abb732c	70	8
\.


--
-- Data for Name: sd_iot_alarm_device_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_alarm_device_event (id, alarm_action_id, device_id) FROM stdin;
0129302f-396c-43f7-97f7-d083869797d7	1	9
ade38564-d86a-45f8-80e8-b89695845283	71	9
e5e6ddf2-303a-49a3-ae4a-b06d7eb9f641	70	10
67878212-2439-4881-aef8-90b8b24ccdf0	70	9
\.


--
-- Data for Name: sd_iot_api; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_api (api_id, api_name, host, port, token_value, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device (device_id, setting_id, type_id, location_id, device_name, sn, hardware_id, status_warning, recovery_warning, status_alert, recovery_alert, time_life, period, work_status, max, min, model, vendor, comparevalue, unit, mqtt_id, oid, action_id, status_alert_id, mqtt_data_value, mqtt_data_control, measurement, mqtt_control_on, mqtt_control_off, org, bucket, status, mqtt_device_name, mqtt_status_over_name, mqtt_status_data_name, mqtt_act_relay_name, mqtt_control_relay_name, createddate, updateddate) FROM stdin;
8	1	1	1	Temperature	8	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	2	1	1	1	BAACTW02/DATA	BAACTW02/CONTROL	temperature	1	0	cmon_org	BAACTW02	1	temperature	overFan1	{"0":"temperature","1":"contRelay1","2":"actRelay1","3":"fan1","4":"overFan1","5":"contRelay2","6":"actRelay2","7":"fan2","8":"overFan2"}	actRelay1	contRelay1	2025-07-11 03:59:48.643594	2025-07-29 04:09:57
9	1	2	1	Fan1	9	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	2	1	1	1	BAACTW02/DATA	BAACTW02/CONTROL	fan1	1	0	cmon_org	BAACTW02	1	fan1	overFan1	{"0":"temperature","1":"contRelay1","2":"actRelay1","3":"fan1","4":"overFan1","5":"contRelay2","6":"actRelay2","7":"fan2","8":"overFan2"}	actRelay1	contRelay1	2025-07-10 07:23:58.321329	2025-07-24 18:58:09.263675
10	1	3	1	Fan2	10	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	2	1	1	1	BAACTW02/DATA	BAACTW02/CONTROL	fan2	3	2	cmon_org	BAACTW02	1	fan2	overFan2	{"0":"temperature","1":"contRelay1","2":"actRelay1","3":"fan1","4":"overFan1","5":"contRelay2","6":"actRelay2","7":"fan2","8":"overFan2"}	actRelay2	contRelay2	2025-07-10 07:24:51.779966	2025-07-24 18:58:11.088894
11	1	1	1	Temperature	11	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	3	1	1	1	BAACTW03/DATA	BAACTW03/CONTROL	temperature	1	0	cmon_org	BAACTW03	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-13 19:21:44.385944	2025-08-04 04:47:04.879139
12	1	2	1	fan1	12	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	3	1	1	1	BAACTW03/DATA	BAACTW03/CONTROL	fan1	1	0	cmon_org	BAACTW03	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-13 20:12:52.499451	2025-08-04 04:47:04.879139
13	1	3	1	fan2	13	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	3	1	1	1	BAACTW03/DATA	BAACTW03/CONTROL	fan2	3	2	cmon_org	BAACTW03	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-13 20:15:45.240595	2025-08-04 04:47:04.879139
14	1	1	1	Temperature	14	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	4	1	1	1	BAACTW04/DATA	BAACTW04/CONTROL	temperature	1	0	cmon_org	BAACTW04	1	temperature	overFan1	 {"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-18 07:14:50.969742	2025-08-05 11:58:24.873701
15	1	2	1	Fan1	15	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	4	1	1	1	BAACTW04/DATA	BAACTW04/CONTROL	fan1	1	0	cmon_org	BAACTW04	1	fan1	overFan1	 {"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-18 07:16:09.572274	2025-08-05 11:58:24.873701
20	1	1	1	Temperature	20	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	6	1	1	1	BAACTW06/DATA	BAACTW06/CONTROL	tmperature	1	0	cmon_org	BAACTW06	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:01:58.912912	2025-08-05 12:14:59.416405
21	1	2	1	Fan1	21	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	6	1	1	1	BAACTW06/DATA	BAACTW06/CONTROL	fan1	1	0	cmon_org	BAACTW06	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:02:45.891187	2025-08-05 12:14:59.416405
24	1	2	1	Fan1	24	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	7	1	1	1	BAACTW07/DATA	BAACTW07/CONTROL	fan1	1	0	cmon_org	BAACTW07	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:11:34.189065	2025-08-05 12:17:10.075369
25	1	3	1	Fan2	25	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	7	1	1	1	BAACTW07/DATA	BAACTW07/CONTROL	fan2	3	2	cmon_org	BAACTW07	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 04:34:50.14121	2025-08-05 12:17:10.075369
28	1	3	1	Fan2	28	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	8	1	1	1	BAACTW08/DATA	BAACTW08/CONTROL	fan2	3	2	cmon_org	BAACTW08	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 04:55:23.634936	2025-07-19 04:55:36.723157
1	1	1	1	Temperature	1	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	1	1	1	1	BAACTW01/DATA	BAACTW01/CONTROL	temperature	1	0	cmon_org	BAACTW01	0	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-10 07:22:37.529797	2025-08-05 12:06:00.615378
2	1	2	1	Fan1	2	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	1	1	1	1	BAACTW01/DATA	BAACTW01/CONTROL	fan1	1	0	cmon_org	BAACTW01	0	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-10 07:23:58.321329	2025-08-05 12:06:00.615378
23	1	1	1	Temperature	23	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	7	1	1	1	BAACTW07/DATA	BAACTW07/CONTROL	tmperature	1	0	cmon_org	BAACTW07	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:10:34.689087	2025-08-05 12:17:10.075369
18	1	2	1	Fan1	18	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	5	1	1	1	BAACTW05/DATA	BAACTW05/CONTROL	fan1	1	0	cmon_org	BAACTW05	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 03:37:29.016002	2025-08-05 12:04:44.792412
22	1	3	1	Fan2	22	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	6	1	1	1	BAACTW06/DATA	BAACTW06/CONTROL	fan2	3	2	cmon_org	BAACTW06	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 04:03:27.291358	2025-08-05 12:14:59.416405
26	1	1	1	Temperature	26	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	8	1	1	1	BAACTW08/DATA	BAACTW08/CONTROL	tmperature	1	0	cmon_org	BAACTW08	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:37:00.387072	2025-07-19 04:55:36.723157
27	1	2	1	Fan1	27	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	8	1	1	1	BAACTW08/DATA	BAACTW08/CONTROL	fan1	1	0	cmon_org	BAACTW08	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 04:38:15.232017	2025-07-19 04:55:36.723157
29	1	1	1	Temperature	29	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	9	1	1	1	BAACTW09/DATA	BAACTW09/CONTROL	tmperature	1	0	cmon_org	BAACTW09	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 07:54:55.88571	2025-08-05 12:24:39.94907
30	1	2	1	Fan1	30	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	9	1	1	1	BAACTW09/DATA	BAACTW09/CONTROL	fan1	1	0	cmon_org	BAACTW09	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 07:56:07.57479	2025-08-05 12:24:39.94907
31	1	3	1	Fan2	31	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	9	1	1	1	BAACTW09/DATA	BAACTW09/CONTROL	fan2	3	2	cmon_org	BAACTW09	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 07:57:11.212999	2025-08-05 12:24:39.94907
32	1	1	1	Temperature	32	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	10	1	1	1	BAACTW10/DATA	BAACTW10/CONTROL	tmperature	1	0	cmon_org	BAACTW10	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:00:09.53003	2025-07-29 07:35:45.086672
33	1	2	1	Fan1	33	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	10	1	1	1	BAACTW10/DATA	BAACTW10/CONTROL	tmperature	1	0	cmon_org	BAACTW10	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:01:18.429304	2025-07-29 07:35:45.086672
35	1	1	1	Temperature	35	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	11	1	1	1	BAACTW11/DATA	BAACTW11/CONTROL	tmperature	1	0	cmon_org	BAACTW11	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:05:38.309487	2025-07-19 08:07:56.411219
36	1	2	1	Fan1	36	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	11	1	1	1	BAACTW11/DATA	BAACTW11/CONTROL	fan1	1	0	cmon_org	BAACTW11	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:06:35.557907	2025-07-19 08:07:56.411219
73	1	1	1	Temperature	73	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	13	1	1	1	BAACTW13/DATA	BAACTW13/CONTROL	tmperature	1	0	cmon_org	BAACTW13	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:30:59.089254	2025-07-19 08:34:12.736243
74	1	2	1	Fan1	74	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	13	1	1	1	BAACTW13/DATA	BAACTW13/CONTROL	fan1	1	0	cmon_org	BAACTW13	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:32:06.681533	2025-07-19 08:34:12.736243
76	1	1	1	Temperature	76	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	14	1	1	1	BAACTW14/DATA	BAACTW14/CONTROL	tmperature	1	0	cmon_org	BAACTW14	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:36:12.520456	2025-07-19 08:38:22.47577
77	1	2	1	Fan1	77	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	14	1	1	1	BAACTW14/DATA	BAACTW14/CONTROL	fan1	1	0	cmon_org	BAACTW14	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:37:07.157531	2025-07-19 08:38:22.47577
78	1	3	1	Fan2	78	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	14	1	1	1	BAACTW14/DATA	BAACTW14/CONTROL	fan2	3	2	cmon_org	BAACTW14	1	fan2	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:37:58.377618	2025-07-19 08:38:22.47577
79	1	1	1	Temperature	79	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	15	1	1	1	BAACTW15/DATA	BAACTW15/CONTROL	tmperature	1	0	cmon_org	BAACTW15	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:39:33.605393	2025-08-05 12:31:46.117473
17	1	1	1	Temperature	17	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	5	1	1	1	BAACTW05/DATA	BAACTW05/CONTROL	tmperature	1	0	cmon_org	BAACTW05	1	fan1	overFan1	 {"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 03:32:36.724138	2025-08-05 12:04:44.792412
38	1	1	1	Temperature	38	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	12	1	1	1	BAACTW12/DATA	BAACTW12/CONTROL	tmperature	1	0	cmon_org	BAACTW12	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:09:27.018994	2025-08-05 12:28:26.981744
40	1	3	1	Fan2	40	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	12	1	1	1	BAACTW12/DATA	BAACTW12/CONTROL	fan2	3	2	cmon_org	BAACTW12	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:11:33.179924	2025-08-05 12:28:26.981744
75	1	3	1	Fan2	75	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	13	1	1	1	BAACTW13/DATA	BAACTW13/CONTROL	fan2	3	2	cmon_org	BAACTW13	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:33:48.54082	2025-07-19 08:34:12.736243
80	1	2	1	Fan1	80	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	15	1	1	1	BAACTW15/DATA	BAACTW15/CONTROL	fan1	1	0	cmon_org	BAACTW15	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:40:35.626717	2025-08-05 12:31:46.117473
82	1	1	1	Temperature	82	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	16	1	1	1	BAACTW16/DATA	BAACTW16/CONTROL	tmperature	1	0	cmon_org	BAACTW16	1	tmperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:43:47.603767	2025-07-19 08:45:55.749141
83	1	2	1	Fan1	83	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	16	1	1	1	BAACTW16/DATA	BAACTW16/CONTROL	fan1	1	0	cmon_org	BAACTW16	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:44:50.584999	2025-07-19 08:45:55.749141
84	1	3	1	Fan2	84	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	16	1	1	1	BAACTW16/DATA	BAACTW16/CONTROL	fan2	3	2	cmon_org	BAACTW16	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:45:42.675485	2025-07-21 12:17:19
85	1	1	1	Temperature	85	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	17	1	1	1	BAACTW17/DATA	BAACTW17/CONTROL	temperature	1	0	cmon_org	BAACTW17	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:33:56.503493	2025-07-21 05:36:20.955633
86	1	2	1	Fan1	86	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	17	1	1	1	BAACTW17/DATA	BAACTW17/CONTROL	fan1	1	0	cmon_org	BAACTW17	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:34:51.271585	2025-07-21 05:36:20.955633
87	1	3	1	Fan12	87	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	17	1	1	1	BAACTW17/DATA	BAACTW17/CONTROL	fan2	3	2	cmon_org	BAACTW17	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-21 05:35:40.18173	2025-07-21 05:36:20.955633
88	1	1	1	Temperature	88	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	18	1	1	1	BAACTW18/DATA	BAACTW18/CONTROL	temperature	1	0	cmon_org	BAACTW18	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:41:48.436806	2025-07-21 05:44:17.679362
89	1	2	1	Fan1	89	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	18	1	1	1	BAACTW18/DATA	BAACTW18/CONTROL	fan1	1	0	cmon_org	BAACTW18	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:42:38.806695	2025-07-21 05:44:17.679362
90	1	3	1	Fan2	90	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	18	1	1	1	BAACTW18/DATA	BAACTW18/CONTROL	fan2	3	2	cmon_org	BAACTW18	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-21 05:43:23.376222	2025-07-21 05:44:17.679362
91	1	1	1	Temperature	91	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	19	1	1	1	BAACTW19/DATA	BAACTW19/CONTROL	temperature	1	0	cmon_org	BAACTW19	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:46:18.896538	2025-07-21 05:51:19.934252
92	1	2	1	Fan1	92	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	19	1	1	1	BAACTW19/DATA	BAACTW19/CONTROL	fan1	1	0	cmon_org	BAACTW19	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:49:32.393819	2025-07-21 05:51:19.934252
93	1	3	1	Fan2	93	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	19	1	1	1	BAACTW19/DATA	BAACTW19/CONTROL	fan1	3	2	cmon_org	BAACTW19	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:50:34.331955	2025-07-21 05:51:19.934252
95	1	2	1	Fan1	95	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	20	1	1	1	BAACTW20/DATA	BAACTW20/CONTROL	fan1	1	0	cmon_org	BAACTW20	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-21 05:53:41.041496	2025-07-21 05:54:45.92432
37	1	3	1	Fan2	37	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	11	1	1	1	BAACTW11/DATA	BAACTW11/CONTROL	fan2	3	2	cmon_org	BAACTW11	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:07:43.759029	2025-07-19 08:07:56.411219
101	1	4	5	IO1	101	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	49	1	1	1	AIR2/DATA	AIR2/CONTROL	IO1	1	0	cmon_org	AIR2	0	IO1	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-08 07:23:01.543183	2025-08-11 06:20:12.734741
102	1	5	5	IO2	102	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	49	1	1	1	AIR2/DATA	AIR2/CONTROL	IO2	3	2	cmon_org	AIR2	0	IO2	overIO2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay2	contRelay2	2025-08-08 07:24:58.499878	2025-08-11 06:20:12.734741
7	1	6	5	IO3	7	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	48	1	1	1	AIR1/DATA	AIR1/CONTROL	IO3	5	4	cmon_org	AIR1	0	IO3	overIO3	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay3	contRelay3	2025-07-10 09:21:14.26833	2025-08-11 06:20:14.89976
39	1	2	1	Fan1	39	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	12	1	1	1	BAACTW12/DATA	BAACTW12/CONTROL	fan1	1	0	cmon_org	BAACTW12	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-19 08:10:33.925395	2025-08-05 12:28:26.981744
81	1	3	1	Fan2	81	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	15	1	1	1	BAACTW15/DATA	BAACTW15/CONTROL	fan2	3	2	cmon_org	BAACTW15	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:41:34.975559	2025-08-05 12:31:46.117473
94	1	1	1	Temperature	94	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	20	1	1	1	BAACTW20/DATA	BAACTW20/CONTROL	temperature	1	0	cmon_org	BAACTW20	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay1	2025-07-21 05:52:42.173465	2025-07-21 05:54:45.92432
96	1	3	1	Fan2	96	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	20	1	1	1	BAACTW20/DATA	BAACTW20/CONTROL	fan2	3	2	cmon_org	BAACTW20	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-21 05:54:31.617471	2025-07-21 05:54:45.92432
97	1	1	1	Temperature	97	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	21	1	1	1	BAACTW21/DATA	BAACTW21/CONTROL	temperature	1	0	cmon_org	BAACTW21	1	temperature	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-23 12:49:12.795014	2025-08-04 04:57:06.833814
98	1	2	1	Fan1	98	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	21	1	1	1	BAACTW21/DATA	BAACTW21/CONTROL	fan1	1	0	cmon_org	BAACTW21	1	fan1	overFan1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-23 12:49:53.042003	2025-08-04 04:57:06.833814
99	1	3	1	Fan2	99	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	21	1	1	1	BAACTW21/DATA	BAACTW21/CONTROL	fan2	3	2	cmon_org	BAACTW21	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-23 12:50:38.416197	2025-08-04 04:57:06.833814
3	1	3	1	Fan2	3	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	1	1	1	1	BAACTW01/DATA	BAACTW01/CONTROL	fan2	3	2	cmon_org	BAACTW01	0	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-10 07:24:51.779966	2025-08-05 12:06:00.615378
19	1	3	1	Fan2	19	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	5	1	1	1	BAACTW05/DATA	BAACTW05/CONTROL	fan2	3	2	cmon_org	BAACTW05	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 03:38:15.438231	2025-08-05 12:04:44.792412
34	1	3	1	Fan1	34	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	10	1	1	1	BAACTW10/DATA	BAACTW10/CONTROL	fan2	3	2	cmon_org	BAACTW10	1	fan2	overFan2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay2	contRelay2	2025-07-19 08:02:46.273459	2025-07-29 07:35:45.086672
100	1	1	5	Temperature	100	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	49	1	1	1	AIR2/DATA	AIR2/CONTROL	temperature	1	0	cmon_org	AIR2	0	temperature	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-08 07:19:18.055848	2025-08-11 06:20:12.734741
103	1	6	5	IO3	103	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	49	1	1	1	AIR2/DATA	AIR2/CONTROL	IO3	5	4	cmon_org	AIR2	0	IO3	overIO3	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay3	contRelay3	2025-08-08 07:27:21.6631	2025-08-11 06:20:12.734741
4	1	1	5	Temperature	4	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	48	1	1	1	AIR1/DATA	AIR1/CONTROL	temperature	1	0	cmon_org	AIR1	0	temperature	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-07-10 09:11:26.104342	2025-08-11 06:20:14.89976
5	1	4	5	IO1	5	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	48	1	1	1	AIR1/DATA	AIR1/CONTROL	IO1	1	0	cmon_org	AIR1	0	IO1	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-07-10 09:14:42.222597	2025-08-11 06:20:14.89976
59	1	1	5	Temperature	AIR401	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	50	1	1	1	AIR3/DATA	AIR3/CONTROL	Temperature	1	0	cmon_org	AIR3	0	temperature	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-10 11:39:46.921408	2025-08-11 06:20:09.890457
61	1	5	5	IO2	AIR403	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	50	1	1	1	AIR3/DATA	AIR3/CONTROL	IO2	2	3	cmon_org	AIR3	0	IO2	overIO2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay2	contRelay2	2025-08-10 11:44:17.239832	2025-08-11 06:20:09.890457
62	1	6	5	IO3	AIR404	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	50	1	1	1	AIR3/DATA	AIR3/CONTROL	IO3	5	4	cmon_org	AIR3	0	IO3	overIO3	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay3	contRelay3	2025-08-10 11:46:02.796633	2025-08-11 06:20:09.890457
6	1	5	5	IO2	6	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	48	1	1	1	AIR1/DATA	AIR1/CONTROL	IO2	3	2	cmon_org	AIR1	0	IO2	overIO2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay2	contRelay2	2025-07-10 09:19:53.885929	2025-08-11 06:20:14.89976
16	1	3	1	Fan2	16	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	4	1	1	1	BAACTW04/DATA	BAACTW04/CONTROL	fan2	3	2	cmon_org	BAACTW04	1	fan2	overFan2	 {"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}	actRelay1	contRelay1	2025-07-18 07:17:11.787151	2025-08-05 11:58:24.873701
66	1	6	5	IO3	AIR503	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	51	1	1	1	AIR4/DATA	AIR4/CONTROL	IO3	4	5	cmon_org	AIR4	0	IO3	overIO3	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay3	contRelay3	2025-08-10 14:08:17.185679	2025-08-11 06:20:08.093021
63	1	1	5	Temperature	104	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	51	1	1	1	AIR4/DATA	AIR4/CONTROL	Temperature	1	0	cmon_org	AIR4	0	temperature	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-10 13:55:41.498564	2025-08-11 06:20:08.093021
64	1	4	5	IO1	Cmon104	1	32	25	35	25	3600	35	1	35	25	cmon	cmon	1	°C	51	1	1	1	AIR4/DATA	AIR4/CONTROL	IO1	1	0	cmon_org	AIR4	0	IO1	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-10 13:58:45.205726	2025-08-11 06:20:08.093021
60	1	4	5	IO1	AIR402	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	50	1	1	1	AIR3/DATA	AIR3/CONTROL	IO1	1	0	cmon_org	AIR3	0	IO1	overIO1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay1	contRelay1	2025-08-10 11:42:24.861231	2025-08-11 06:20:09.890457
65	1	5	5	IO2	AIR501	1	32	1	35	25	3600	35	1	35	25	cmon	cmon	1	°C	51	1	1	1	AIR4/DATA	AIR4/CONTROL	IO2	2	3	cmon_org	AIR4	0	IO2	overIO2	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}	actRelay2	contRelay2	2025-08-10 14:05:33.963061	2025-08-11 06:20:08.093021
\.


--
-- Data for Name: sd_iot_device_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device_action (device_action_user_id, alarm_action_id, device_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: sd_iot_device_action_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device_action_log (log_id, alarm_action_id, device_id, uid, status, createddate) FROM stdin;
\.


--
-- Data for Name: sd_iot_device_action_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device_action_user (device_action_user_id, alarm_action_id, uid) FROM stdin;
\.


--
-- Data for Name: sd_iot_device_alarm_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device_alarm_action (alarm_action_id, action_name, status_warning, recovery_warning, status_alert, recovery_alert, email_alarm, line_alarm, telegram_alarm, sms_alarm, nonc_alarm, time_life, event, status) FROM stdin;
1	 Alarm Sensor ON	32	33	38	33	1	1	1	1	1	60	1	1
70	 Alarm Sensor  OFF	30	25	32	25	1	0	0	0	0	60	0	0
71	 Alarm IO	0	1	0	1	1	0	0	0	0	60	1	1
\.


--
-- Data for Name: sd_iot_device_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_device_type (type_id, type_name, createddate, updateddate, status) FROM stdin;
1	Sensor	2025-07-02 14:36:14	2025-07-02 14:36:17	1
2	Device IO Fan1	2025-07-02 14:36:29	2025-07-02 14:36:31	1
3	Device IO Fan2	2025-07-04 19:30:52	2025-07-04 19:30:54	1
4	Device IO Air1	2025-07-09 05:33:33.896587	2025-07-09 05:33:33.896587	1
5	Device IO Air2	2025-07-09 05:33:42.667424	2025-07-09 05:33:42.667424	1
6	Device IO Air3	2025-07-09 13:18:10	2025-07-09 13:18:12	1
\.


--
-- Data for Name: sd_iot_email; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_email (email_id, email_name, host, port, username, password, createddate, updateddate, status) FROM stdin;
8d42d344-7ef7-49b2-a724-4929f6fe83b7	monitoring.system.report	smtp.gmail.com	456	monitoring.system.report@gmail.com	owortggrxrqhubxa	2025-08-08 18:57:21.771293	2025-08-11 17:44:18	0
ce4e55c3-3adf-4829-bfdc-a500765888ea	icmon0955	smtp.gmail.com	465	icmon0955@gmail.com	mbwodofvkznougir	2025-08-08 17:13:08.06419	2025-08-11 17:44:18	0
07c13e1b-73d9-4215-86ab-e5e9a2ae418c	kongnakornit	smtp.gmail.com	456	kongnakornit@gmail.com	asahzdatmywtwrji	2025-08-11 10:22:07.975175	2025-08-11 10:44:18.100012	1
\.


--
-- Data for Name: sd_iot_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_group (group_id, group_name, createddate, updateddate, status) FROM stdin;
2	Sensor	2025-06-14 05:32:08.221808	2025-06-14 05:32:08.221808	1
\.


--
-- Data for Name: sd_iot_host; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_host (host_id, host_name, port, username, password, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_influxdb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_influxdb (influxdb_id, influxdb_name, host, port, username, password, token_value, createddate, updateddate, status, buckets) FROM stdin;
\.


--
-- Data for Name: sd_iot_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_line (line_id, line_name, port, username, password, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_location (location_id, location_name, ipaddress, location_detail, createddate, updateddate, status, configdata) FROM stdin;
5	ธกส ระบบแอร์	192.168.1.57	Air	2025-07-08 16:09:59	2025-07-08 16:10:01	1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"IO1","5":"overIO1","6":"contRelay2","7":"actRelay2","8":"IO2","9":"overIO2","10":"contRelay3","11":"actRelay3","12":"IO3","13":"overIO3"}
1	ธกส ระบบพัดลม	192.168.1.37	Fan	2025-06-14 05:31:26.774385	2025-06-14 05:31:26.774385	1	{"0":"bucket","1":"temperature","2":"contRelay1","3":"actRelay1","4":"fan1","5":"overFan1","6":"contRelay2","7":"actRelay2","8":"fan2","9":"overFan2"}
\.


--
-- Data for Name: sd_iot_mqtt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_mqtt (mqtt_id, mqtt_type_id, sort, mqtt_name, host, port, username, password, secret, expire_in, token_value, org, bucket, envavorment, createddate, updateddate, status, location_id, latitude, longitude) FROM stdin;
2	1	2	อาคาร 1 ชั้น 1	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW02	measurement	2025-07-02 17:46:24.901486	2025-08-05 11:40:41	1	1	1.022	-12.52
3	1	3	อาคาร 1 ชั้น 2	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW03	measurement	2025-08-05 11:00:39.967201	2025-08-05 11:00:39.967201	1	1	1.022	-12.52
4	1	4	อาคาร 1 ชั้น 3	192.168.1.59	8089	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW04	measurement	2025-08-05 11:57:51.701548	2025-08-05 11:58:24.858831	1	1	1.022	-25.110
5	1	5	อาคาร 1 ชั้น 4	192.168.1.59	8086	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW05	measurement	2025-08-05 12:04:37.922718	2025-08-05 12:04:44.784605	1	1	1.022	-12.52
1	1	1	อาคาร 1  ชั้นใต้ดิน	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW01	measurement	2025-07-02 17:45:47.490628	2025-08-05 12:06:00.606845	0	1	10.025	-15.665
10	1	10	อาคาร 1 ชั้น 9	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW10	measurement	2025-07-02 17:58:11.181382	2025-07-29 07:35:45.082001	1	1	\N	\N
11	1	11	อาคาร 1 ชั้น 10	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW11	measurement	2025-07-02 17:59:22.793245	2025-07-19 08:07:56.403522	1	1	\N	\N
8	1	8	อาคาร 1 ชั้น 7	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW08	measurement	2025-07-02 17:55:12.306466	2025-07-19 04:55:36.713785	1	1	\N	\N
6	1	6	อาคาร 1 ชั้น 5	192.168.1.59	8089	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW06	measurement	2025-08-05 12:14:53.52864	2025-08-05 12:14:59.40803	1	1		
7	1	7	อาคาร 1 ชั้น 6	192.168.1.59	8089	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW07	measurement	2025-08-05 12:17:05.211978	2025-08-05 12:17:10.067139	1	1		
9	1	9	อาคาร 1 ชั้น 8	192.168.1.59	8089	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW09	measurement	2025-08-05 12:24:01.367645	2025-08-05 12:24:39.942895	1	1		
12	1	12	อาคาร 1 ชั้น 11	192.168.1.59	8089	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW12	measurement	2025-08-05 12:28:11.068814	2025-08-05 12:28:26.971645	1	1		
13	1	13	อาคาร 1 ชั้น 12	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW13	measurement	2025-07-02 18:02:12.555345	2025-07-19 08:34:12.725127	1	1	\N	\N
14	1	14	อาคาร 1 ชั้น 13	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW14	measurement	2025-07-02 18:04:26.522866	2025-07-19 08:38:22.467919	1	1	\N	\N
15	1	15	อาคาร 1 ชั้น 14	192.168.1.59	8089	admin	Na@0955##	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW15	measurement	2025-08-05 12:31:36.721183	2025-08-05 12:31:46.11151	1	1		
16	1	16	อาคาร 1 ชั้น 15	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW16	measurement	2025-07-02 18:10:02.175493	2025-07-19 08:45:55.741128	1	1	\N	\N
17	1	17	อาคาร 1 ชั้น 16	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW17	measurement	2025-07-02 18:11:17.185464	2025-07-21 05:36:20.947299	1	1	\N	\N
18	1	18	อาคาร 1 ชั้น 17	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW18	measurement	2025-07-02 18:12:16.790785	2025-07-21 05:44:17.670472	1	1	\N	\N
19	1	19	อาคาร 1 ชั้น 18	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW19	measurement	2025-07-02 18:21:08.263892	2025-07-21 05:51:19.890904	1	1	\N	\N
20	1	20	อาคาร 1 ชั้น 19	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW20	measurement	2025-07-02 18:22:00.368086	2025-07-21 05:54:45.873789	1	1	\N	\N
21	1	21	อาคาร 1 ชั้น 20	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW21	measurement	2025-07-02 18:23:22.780183	2025-08-04 04:57:06.830076	1	1	\N	\N
22	1	22	อาคาร 1 ชั้น 21	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW22	measurement	2025-07-02 18:25:52.362096	2025-07-09 05:30:17.569592	0	1	\N	\N
23	1	23	อาคาร 1 ชั้น 22	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW23	measurement	2025-07-02 18:27:41.316091	2025-07-08 07:40:40.77206	0	1	\N	\N
24	1	24	อาคาร 1 ชั้น 23	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW24	measurement	2025-07-02 18:29:01.801024	2025-07-08 07:40:38.285608	0	1	\N	\N
25	1	25	อาคาร 1 ชั้น 24	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW25	measurement	2025-07-02 18:30:09.416368	2025-07-08 07:40:35.722326	0	1	\N	\N
26	1	26	อาคาร 1 ชั้น 25	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW26	measurement	2025-07-02 18:34:34.375539	2025-07-08 07:40:33.172237	0	1	\N	\N
27	1	27	อาคาร 1 ชั้น 26	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW27	measurement	2025-07-02 18:36:55.327374	2025-07-08 07:40:30.848776	0	1	\N	\N
28	1	28	อาคาร 1 ชั้น 27	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW28	measurement	2025-07-02 18:38:02.691683	2025-07-08 07:40:26.709244	0	1	\N	\N
29	1	29	อาคาร 1 ชั้น 28	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW29	measurement	2025-07-02 18:39:27.714616	2025-07-08 07:40:24.103614	0	1	\N	\N
30	1	30	อาคาร 1 ชั้น 29	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW30	measurement	2025-07-02 18:40:27.683204	2025-07-08 07:40:21.598147	0	1	\N	\N
31	1	31	อาคาร 1 ชั้น 30	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW31	measurement	2025-07-02 18:42:12.800326	2025-07-08 07:40:19.066338	0	1	\N	\N
32	1	32	อาคาร 1 ชั้น 31	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW32	measurement	2025-07-02 18:43:28.590838	2025-07-08 07:40:16.37704	0	1	\N	\N
33	1	33	อาคาร 1 ชั้น 32	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW33	measurement	2025-07-02 18:45:51.548631	2025-07-08 07:40:13.606847	0	1	\N	\N
34	1	34	อาคาร 1 ชั้น 33	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW34	measurement	2025-07-02 18:47:42.560025	2025-07-08 07:40:10.86767	0	1	\N	\N
35	1	35	อาคาร 1 ชั้น 34	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW35	measurement	2025-07-02 18:49:57.530826	2025-07-08 07:40:07.95824	0	1	\N	\N
36	1	36	อาคาร 1 ชั้น 35	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW36	measurement	2025-07-02 18:52:16.643044	2025-07-08 07:40:05.18667	0	1	\N	\N
37	1	37	อาคาร 1 ชั้น 36	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW37	measurement	2025-07-02 18:54:11.322743	2025-07-08 07:40:02.344448	0	1	\N	\N
38	1	38	อาคาร 1 ชั้น 37	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW38	measurement	2025-07-02 18:55:03.603544	2025-07-08 07:39:58.214827	0	1	\N	\N
39	1	39	อาคาร 1 ชั้น 38	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW39	measurement	2025-07-02 18:56:11.980052	2025-07-08 07:39:55.082086	0	1	\N	\N
40	1	40	อาคาร 1 ชั้น 39	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW40	measurement	2025-07-02 18:57:17.116998	2025-07-08 07:39:51.768705	0	1	\N	\N
41	1	41	อาคาร 1 ชั้น 40	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW41	measurement	2025-07-02 18:57:50.080716	2025-07-08 07:39:48.699803	0	1	\N	\N
42	1	42	อาคาร 1 ชั้น 41	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW42	measurement	2025-07-03 02:19:50.087164	2025-07-08 07:39:45.569379	0	1	\N	\N
43	1	43	อาคาร 1 ชั้น 42	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW43	measurement	2025-07-03 04:31:27.737147	2025-07-08 07:39:42.820828	0	1	\N	\N
44	1	44	อาคาร 1 ชั้น 43	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW44	measurement	2025-07-03 04:34:35.272433	2025-07-09 01:15:00.031229	0	1	\N	\N
46	1	46	อาคาร 1 ชั้น 45	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW46	measurement	2025-07-03 04:41:50.784821	2025-07-03 11:42:16	0	1	\N	\N
47	1	47	อาคาร 1 ชั้น 46	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW47	measurement	2025-07-03 11:50:47.902532	2025-07-05 11:32:04	0	1	\N	\N
53	1	53	อาคาร 1 ชั้น 6 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR6	measurement	2025-08-05 15:05:28.056932	2025-08-05 15:05:28.056932	0	5		
45	1	45	อาคาร 1 ชั้น 44	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	BAACTW45	measurement	2025-07-03 04:39:13.63353	2025-07-03 04:39:13.63353	0	1	\N	\N
54	1	54	อาคาร 1 ชั้น 7 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR7	measurement	2025-08-05 15:08:11.579966	2025-08-05 15:08:11.579966	0	5		
55	1	55	อาคาร 1 ชั้น 8 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR8	measurement	2025-08-05 15:09:58.401591	2025-08-05 15:09:58.401591	0	5		
88	1	56	อาคาร 1 ชั้น 9 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR9	measurement	2025-08-08 07:16:16.697963	2025-08-08 07:16:16.697963	0	5		
52	1	52	อาคาร 1 ชั้น 5 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR5	measurement	2025-08-05 14:48:51.897808	2025-08-10 14:09:07.955359	1	5		
51	1	51	อาคาร 1 ชั้น 4 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR4	measurement	2025-08-05 14:47:16.065451	2025-08-11 06:20:08.072377	0	5		
50	1	50	อาคาร 1 ชั้น 3 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR3	measurement	2025-08-05 14:46:29.133578	2025-08-11 06:20:09.871119	0	5		
48	1	48	อาคาร 1 ชั้น 1 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955##	365d	BcKyMJK-AVist7GQkkb30Fm-LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR1	measurement	2025-07-08 11:02:53.09007	2025-08-11 06:20:14.880756	0	5	1.2055	0.25
49	1	49	อาคาร 1 ชั้น 2 ระบบแอร์	192.168.1.59	8086	admin	Na@0955@#@#	Na@0955@#@#	365d	LZZnAVeQrG4hXWetVtYow5Wal_dIYoRYFLAV1vqlQM0J7o_OXTP62P6ktYxB3Q==	cmon_org	AIR2	measurement	2025-08-05 14:45:30.811226	2025-08-11 06:20:12.730507	0	5	12.011	-52.66
\.


--
-- Data for Name: sd_iot_nodered; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_nodered (nodered_id, nodered_name, host, port, routing, client_id, grant_type, scope, username, password, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_schedule (schedule_id, schedule_name, device_id, start, event, sunday, monday, tuesday, wednesday, thursday, friday, saturday, createddate, updateddate, status) FROM stdin;
20	TASK 13	1	21:00	1	1	1	1	1	1	1	1	2025-07-30 13:16:19.692145	2025-08-02 21:37:16.951	1
19	TASK 12	1	20:00	0	1	1	1	1	1	1	1	2025-07-30 13:15:48.723569	2025-08-02 14:50:21.695072	1
18	TASK 11	1	19:00	1	1	1	1	1	1	1	1	2025-07-30 13:15:20.6672	2025-08-02 14:50:23.756915	1
23	TASK 16	1	23:59	0	1	1	1	1	1	1	1	2025-07-30 13:18:26.661226	2025-08-02 14:50:28.566053	1
24	TASK 17	1	01:00	1	1	1	1	1	1	1	1	2025-07-30 13:19:08.573638	2025-08-02 14:50:30.712776	1
25	TASK 18	1	02:00	0	1	1	1	1	1	1	1	2025-07-30 13:19:36.436198	2025-08-02 14:50:32.654482	1
21	TASK 14	1	22:00	0	1	1	1	1	1	1	1	2025-07-30 13:16:58.5464	2025-08-02 15:20:11.367794	1
3	TASK 3	1	07:00	1	1	1	1	1	1	1	1	2025-07-04 14:56:16.512273	2025-08-02 06:41:18.936905	1
2	TASK 2	1	06:00	0	1	1	1	1	1	1	1	2025-07-04 14:54:28.066507	2025-08-02 13:41:32.798	1
4	TASK 4	1	08:00	0	1	1	1	1	1	1	1	2025-07-04 15:16:05.286756	2025-08-02 06:41:43.467756	1
5	TASK 5	1	09:00	1	1	1	1	1	1	1	1	2025-07-04 15:18:14.037309	2025-08-02 06:41:45.86536	1
6	TASK 6	1	14:00	0	1	1	1	1	1	1	1	2025-07-04 15:21:48.714074	2025-08-02 06:41:49.24423	1
7	TASK 7	1	15:00	1	1	1	1	1	1	1	1	2025-07-04 15:23:00.502995	2025-08-02 06:41:51.427397	1
22	TASK 15	1	23:00	1	1	1	1	1	1	1	1	2025-07-30 13:17:54.712381	2025-08-02 22:20:25.824	1
8	TASK 8	1	16:00	0	1	1	1	1	1	1	1	2025-07-04 15:25:15.71962	2025-08-02 06:41:53.401616	1
9	TASK 9	1	17:00	1	1	1	1	1	1	1	1	2025-07-04 15:34:38.981455	2025-08-02 06:41:55.865649	1
10	TASK 10	1	18:00	0	1	1	1	1	1	1	1	2025-07-04 15:35:33.565295	2025-08-02 06:41:58.596015	1
1	TASK 1 	1	05:00	1	1	1	1	1	1	1	1	2025-06-16 02:31:55.869785	2025-08-05 14:14:17.422	1
\.


--
-- Data for Name: sd_iot_schedule_device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_schedule_device (id, schedule_id, device_id) FROM stdin;
ad965985-d98e-4373-9300-4b02d8172d70	2	9
e50756fc-12cf-4bac-b6e0-76312d99ca2e	1	9
e64e0b27-b462-4444-a7a6-1d1db8490248	5	9
5c22af4b-17ad-4b2f-a391-703ec7b6353b	6	9
5a203bc0-aed3-4f36-a716-858be7629637	7	10
992a4edb-3268-4a8d-ba2a-4ee622a601cd	8	10
a3918957-0f89-47a3-8b18-f0af31f8474f	9	10
40a2d068-85d6-478c-9659-3e1ecc8b140f	10	9
d77015b1-2809-4ddf-90dd-3355e5a9db07	10	10
ff5820aa-f2cd-4c31-8fd5-afca2100de3c	9	9
23bc18ec-c268-4294-a5a0-2cdbd1263f6a	5	10
becc10cf-3983-444e-8a39-d1797d0995e7	6	10
717b4df0-df61-4945-8ddd-bb21ea3a3ace	7	9
b238d8ae-2c31-4ced-8479-a3d006b008a2	8	9
5aa584dd-3be4-4868-9178-a744d6a78f42	3	9
9295afcc-2403-4d6b-bf38-129348e91fae	4	9
afc5b25a-ef88-4093-9112-0d25f9afde06	1	10
b524dc1f-bf4b-439c-b9b5-79bfb63bcafc	3	10
5b00ced2-aad9-4aa7-af8f-1fb63d2f43fe	18	9
343f05aa-a8ea-4120-a0c7-4607bdd0a9d4	18	10
2cf372af-9903-4db2-ad38-7ad44e1332aa	19	9
c324dc33-199c-4dd1-816d-040adcddaff9	19	10
788897bf-a08f-4a99-9e4e-e6b6b9d637d9	20	9
14bc16f8-6b0d-4f70-99ba-e6b0c29307c7	20	10
24206ece-f053-4e9e-848b-b119aff88e9f	21	9
06c00b15-3df3-432a-af34-9112d0b1de3f	21	10
4d86a07b-33ab-4407-8f62-f6d39089c733	22	9
5429a9eb-98f6-412b-bc68-e4fce1aea413	22	10
40432d4d-325e-4945-9e2d-556d02514b69	23	9
3e2f7a7c-02e9-4df3-8d2b-1cc8cfd9a0a0	23	10
93b76ff7-1a26-4f9f-8fda-7ef50f55dd49	24	9
ae6f0933-ddda-4cb0-847d-dc8bfd488fdf	24	10
2d4346aa-00bd-4dbe-aef6-47fef9fc6c71	25	9
0b9566db-45bf-468c-a627-e6f26fd9a14e	2	10
9defe6f0-c68e-4e93-8bf7-433ab3e2ce59	4	10
\.


--
-- Data for Name: sd_iot_sensor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_sensor (sensor_id, setting_id, setting_type_id, sensor_name, sn, max, min, hardware_id, status_high, status_warning, status_alert, model, vendor, comparevalue, createddate, updateddate, status, unit, mqtt_id, oid, action_id, status_alert_id, mqtt_data_value, mqtt_data_control) FROM stdin;
2	1	1	temperature	TS_001	100	0	1	90	60	45	model-1	vendor-1	0	2025-06-14 05:31:55.964183	2025-06-14 05:31:55.964183	1	°C	1	1111111111111111	1	1	BAACTW02/DATA	BAACTW02/CONTROL
\.


--
-- Data for Name: sd_iot_setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_setting (setting_id, location_id, setting_type_id, setting_name, sn, createddate, updateddate, status) FROM stdin;
1	1	1	ธนาคาร ธกส 	CMON-IS-2025-06-12-3	2025-06-14 05:31:10.377656	2025-06-14 05:31:10.377656	1
\.


--
-- Data for Name: sd_iot_sms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_sms (sms_id, sms_name, host, port, username, password, apikey, originator, createddate, updateddate, status) FROM stdin;
5428cab3-29d9-4826-b866-c7ab2deec4de	SMS1	192.168.1.59	80	root	root	aaaa	aaaa	2025-08-10 17:16:41.990862	2025-08-11 11:50:46	0
2ed51ff7-d696-4fca-838f-5c6f0b2e5ea7	SMS2	192.168.1.57	80	admin	admin	55	55	2025-08-10 17:16:54.634147	2025-08-11 04:50:46.481782	1
\.


--
-- Data for Name: sd_iot_telegram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_telegram (telegram_id, telegram_name, port, username, password, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_token (token_id, token_name, host, port, token_value, createddate, updateddate, status) FROM stdin;
\.


--
-- Data for Name: sd_iot_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_iot_type (type_id, type_name, group_id, createddate, updateddate, status) FROM stdin;
1	MQTT	1	2025-06-14 05:31:39.53646	2025-06-14 05:31:39.53646	1
2	SNMP	1	2025-06-18 20:08:39	2025-06-18 20:08:41	1
3	GPS	1	2025-08-05 08:51:49	2025-08-05 08:51:52	1
4	MAP	1	2025-08-05 08:57:41	2025-08-05 08:57:45	1
\.


--
-- Data for Name: sd_mqtt_host; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_mqtt_host (id, hostname, host, port, username, password, createddate, updateddate, status) FROM stdin;
ac9eafeb-5bb3-48a2-87eb-cf28121e9310	MQTT IP 59	mqtt://192.168.1.59:1883	1883	admin	admin	2025-08-09 10:57:16.983012	2025-08-11 12:32:50	0
f10b15d6-9730-4b55-9fc0-8aca83f046fb	MQTT IP 57	mqtt://192.168.1.57:1883	1883	admin	admin	2025-08-09 10:46:39.10217	2025-08-11 05:32:50.199015	1
\.


--
-- Data for Name: sd_schedule_process_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_schedule_process_log (id, schedule_id, device_id, schedule_event_start, day, doday, dotime, schedule_event, device_status, status, date, "time", createddate, updateddate) FROM stdin;
2b1f525f-752a-4f74-b2eb-a60fa6b0861e	21	9	22:00	saturday	saturday	2025-08-02 22:21:03	0	0	1	2025-08-02	22:26	2025-08-02 22:21:06	2025-08-02 22:26:40
3cf36060-b429-4537-9963-8a898fe3a527	21	10	22:00	saturday	saturday	2025-08-02 22:21:06	2	2	1	2025-08-02	22:26	2025-08-02 22:21:11	2025-08-02 22:26:40
c7b2925f-4260-4f89-bc4e-357cf38aa75d	3	9	07:00	tuesday	tuesday	2025-08-05 07:10:02	1	1	1	2025-08-05	07:10	2025-08-05 07:10:05	2025-08-05 07:10:05
d41f3a4a-6aa0-407e-9e2f-31b6e1e25944	3	10	07:00	tuesday	tuesday	2025-08-05 07:10:05	3	3	1	2025-08-05	07:10	2025-08-05 07:10:10	2025-08-05 07:10:10
cd997e8f-548c-4f7f-a5c5-4ad380ec93eb	4	9	08:00	tuesday	tuesday	2025-08-05 08:09:19	0	0	1	2025-08-05	08:09	2025-08-05 08:09:19	2025-08-05 08:09:19
fa69c03e-b283-4059-b550-b7cf4fe62872	4	10	08:00	tuesday	tuesday	2025-08-05 08:09:19	2	2	1	2025-08-05	08:09	2025-08-05 08:09:24	2025-08-05 08:09:24
080004c0-e0a5-406a-90c7-43e3968a2cd1	5	9	09:00	tuesday	tuesday	2025-08-05 09:00:01	1	1	1	2025-08-05	09:00	2025-08-05 09:00:04	2025-08-05 09:00:04
b7ce7bbc-26de-4ecd-85ef-e601ad770a2e	5	10	09:00	tuesday	tuesday	2025-08-05 09:00:04	3	3	1	2025-08-05	09:00	2025-08-05 09:00:09	2025-08-05 09:00:09
acd8a46e-fbe6-493a-a901-659f4cf59699	6	9	14:00	tuesday	tuesday	2025-08-05 14:00:43	0	0	1	2025-08-05	14:00	2025-08-05 14:00:44	2025-08-05 14:00:44
172de100-1468-4526-8a2c-25c5a9b1628b	6	10	14:00	tuesday	tuesday	2025-08-05 14:00:45	2	2	1	2025-08-05	14:00	2025-08-05 14:00:49	2025-08-05 14:00:49
9dd08012-bc31-42ba-a52e-dc8012042c19	19	9	20:00	tuesday	tuesday	2025-08-05 20:30:00	0	0	1	2025-08-05	20:30	2025-08-05 20:30:22	2025-08-05 20:30:22
fe2138c9-4772-4d6a-bc91-47c0d260cf53	19	10	20:00	tuesday	tuesday	2025-08-05 20:30:22	2	2	1	2025-08-05	20:30	2025-08-05 20:30:27	2025-08-05 20:30:27
00ee0c53-3f3b-490a-a02b-fb0fd9b34fb5	24	9	01:00	sunday	sunday	2025-08-03 01:02:01	1	1	1	2025-08-03	01:01	2025-08-03 01:02:01	2025-08-03 01:02:01
1a5e1f43-617a-43c8-9343-1ab6c5f9ffce	24	10	01:00	sunday	sunday	2025-08-03 01:02:01	3	3	1	2025-08-03	01:02	2025-08-03 01:02:06	2025-08-03 01:02:06
85761401-094a-473c-a5be-9b85579f870f	25	9	02:00	sunday	sunday	2025-08-03 02:01:41	0	0	1	2025-08-03	02:01	2025-08-03 02:01:41	2025-08-03 02:01:41
f90333d7-e9d1-41fd-bddd-bf6d10a65f6b	25	10	02:00	sunday	sunday	2025-08-03 02:01:42	2	2	1	2025-08-03	02:01	2025-08-03 02:01:46	2025-08-03 02:01:46
52e79c92-f377-4f3c-bf3b-7115b49709bd	1	9	05:00	sunday	sunday	2025-08-03 05:01:19	1	1	1	2025-08-03	05:01	2025-08-03 05:01:22	2025-08-03 05:01:22
0ccebc41-d63b-4afe-a7be-689a85f68225	1	10	05:00	sunday	sunday	2025-08-03 05:01:22	3	3	1	2025-08-03	05:01	2025-08-03 05:01:27	2025-08-03 05:01:27
5c68ff16-e942-4371-86cc-f9ce10ecede0	6	9	14:00	sunday	sunday	2025-08-03 14:01:30	0	0	1	2025-08-03	14:01	2025-08-03 14:01:32	2025-08-03 14:01:32
5b772d7b-5c77-4975-aeb4-fede8bcb83a0	6	10	14:00	sunday	sunday	2025-08-03 14:01:32	2	2	1	2025-08-03	14:01	2025-08-03 14:01:37	2025-08-03 14:01:37
ffbe638e-faea-4843-ade9-cecabeecae4b	7	9	15:00	sunday	sunday	2025-08-03 15:01:02	1	1	1	2025-08-03	15:01	2025-08-03 15:01:02	2025-08-03 15:01:02
96f8282d-81b7-40a7-b217-358157be5d71	7	10	15:00	sunday	sunday	2025-08-03 15:01:02	3	3	1	2025-08-03	15:01	2025-08-03 15:01:07	2025-08-03 15:01:07
c3fc6750-adb7-4b7a-a696-a00a8340f95b	8	9	16:00	sunday	sunday	2025-08-03 16:00:06	0	0	1	2025-08-03	16:00	2025-08-03 16:00:07	2025-08-03 16:00:07
58f698b8-31e1-404e-bbdb-53e69986fd38	8	10	16:00	sunday	sunday	2025-08-03 16:00:07	2	2	1	2025-08-03	16:00	2025-08-03 16:00:12	2025-08-03 16:00:12
c34333b0-175e-4bfb-85e3-9b9c09d7a393	9	9	17:00	sunday	sunday	2025-08-03 17:01:36	1	1	1	2025-08-03	17:01	2025-08-03 17:01:37	2025-08-03 17:01:37
7fce5505-1f5f-43ad-bd21-158f9bc07f42	9	10	17:00	sunday	sunday	2025-08-03 17:01:37	3	3	1	2025-08-03	17:01	2025-08-03 17:01:42	2025-08-03 17:01:42
55b0e515-9e9c-4ed1-aba4-1fdba599b2f5	10	9	18:00	sunday	sunday	2025-08-03 18:01:36	0	0	1	2025-08-03	18:01	2025-08-03 18:01:37	2025-08-03 18:01:37
8768fec8-7796-4c14-87f3-7b357a0c4a96	10	10	18:00	sunday	sunday	2025-08-03 18:01:37	2	2	1	2025-08-03	18:01	2025-08-03 18:01:42	2025-08-03 18:01:42
3409b936-c36f-417f-b4e8-0e34468cf792	18	9	19:00	sunday	sunday	2025-08-03 19:01:35	1	1	1	2025-08-03	19:01	2025-08-03 19:01:37	2025-08-03 19:01:37
8e0baed4-3d1f-4cae-8512-dc55e713ec1c	18	10	19:00	sunday	sunday	2025-08-03 19:01:37	3	3	1	2025-08-03	19:01	2025-08-03 19:01:42	2025-08-03 19:01:42
622268ce-daff-4dd3-8705-fb89a6b025ac	19	9	20:00	sunday	sunday	2025-08-03 20:01:36	0	0	1	2025-08-03	20:01	2025-08-03 20:01:37	2025-08-03 20:01:37
9f787d82-9234-4e76-88a7-4962a8b5578c	19	10	20:00	sunday	sunday	2025-08-03 20:01:37	2	2	1	2025-08-03	20:01	2025-08-03 20:01:42	2025-08-03 20:01:42
29a1dd17-8375-4d1a-9a5d-9dfa02fe4e4c	6	9	14:00	monday	monday	2025-08-04 14:03:19	0	0	1	2025-08-04	14:03	2025-08-04 14:03:23	2025-08-04 14:03:23
ac398207-00d4-4293-a366-268f211eb53a	6	10	14:00	monday	monday	2025-08-04 14:03:23	2	2	1	2025-08-04	14:03	2025-08-04 14:03:28	2025-08-04 14:03:28
2ff12451-07a2-4031-8721-4038ffbd6874	7	9	15:00	monday	monday	2025-08-04 15:06:33	1	1	1	2025-08-04	15:06	2025-08-04 15:06:33	2025-08-04 15:06:33
30bd5c78-fd61-4899-90f1-5b92cbc0032e	7	10	15:00	monday	monday	2025-08-04 15:06:33	3	3	1	2025-08-04	15:06	2025-08-04 15:06:38	2025-08-04 15:06:38
a925347b-dcdd-4ff8-a459-73e9e9805eda	8	9	16:00	monday	monday	2025-08-04 16:06:32	0	0	1	2025-08-04	16:06	2025-08-04 16:06:33	2025-08-04 16:06:33
f2750c9f-2e49-4d11-95d5-6835758ad096	8	10	16:00	monday	monday	2025-08-04 16:06:33	2	2	1	2025-08-04	16:06	2025-08-04 16:06:38	2025-08-04 16:06:38
5dcf3c0c-ac5a-40b9-af40-cc3635c43642	9	9	17:00	monday	monday	2025-08-04 17:06:32	1	1	1	2025-08-04	17:06	2025-08-04 17:06:34	2025-08-04 17:06:34
42a86683-91d3-4f60-84bc-84f4bc423ec6	9	10	17:00	monday	monday	2025-08-04 17:06:34	3	3	1	2025-08-04	17:06	2025-08-04 17:06:39	2025-08-04 17:06:39
d973438e-7f8b-4462-a0e2-d6ced6ded552	18	9	19:00	monday	monday	2025-08-04 19:06:31	1	1	1	2025-08-04	19:06	2025-08-04 19:06:34	2025-08-04 19:06:34
29f592f4-5140-4874-93f6-5c69bca560cf	6	9	14:00	wednesday	wednesday	2025-08-06 14:05:58	0	0	1	2025-08-06	14:05	2025-08-06 14:05:58	2025-08-06 14:05:58
72c23eb5-bd7f-4f12-818b-e7244933d572	18	10	19:00	monday	monday	2025-08-04 19:06:34	3	3	1	2025-08-04	19:06	2025-08-04 19:06:39	2025-08-04 19:06:39
6e084e3b-fd0f-4a20-84b1-5f5467b79758	19	9	20:00	monday	monday	2025-08-04 20:06:31	0	0	1	2025-08-04	20:06	2025-08-04 20:06:34	2025-08-04 20:06:34
8e2f0ffb-1664-4d59-ad61-75ca53a14fa9	19	10	20:00	monday	monday	2025-08-04 20:06:34	2	2	1	2025-08-04	20:06	2025-08-04 20:06:39	2025-08-04 20:06:39
129bc6e9-5a67-498e-830f-be808547d34a	20	9	21:00	monday	monday	2025-08-04 21:06:31	1	1	1	2025-08-04	21:06	2025-08-04 21:06:35	2025-08-04 21:06:35
7e004b1f-d317-48b7-ab7d-5d8b60e69e68	20	10	21:00	monday	monday	2025-08-04 21:06:35	3	3	1	2025-08-04	21:06	2025-08-04 21:06:40	2025-08-04 21:06:40
8b1bd629-3dbd-4671-bc5b-93f0dedc7d05	6	10	14:00	wednesday	wednesday	2025-08-06 14:05:59	2	2	1	2025-08-06	14:05	2025-08-06 14:06:04	2025-08-06 14:06:04
c1acd5a7-c7c0-4357-b2e7-3418aabc4d6e	21	9	22:00	monday	monday	2025-08-04 22:06:29	0	0	1	2025-08-04	22:06	2025-08-04 22:06:30	2025-08-04 22:06:30
c8e4553f-3628-4129-b2ee-260b2d533b72	21	10	22:00	monday	monday	2025-08-04 22:06:30	2	2	1	2025-08-04	22:06	2025-08-04 22:06:35	2025-08-04 22:06:35
3fe03be3-59b8-4b6b-b8d1-323eda586e6e	22	9	23:00	monday	monday	2025-08-04 23:01:02	1	1	1	2025-08-04	23:01	2025-08-04 23:01:05	2025-08-04 23:01:05
96d1f8ff-13dd-4c02-a927-37ed35caa0ba	22	10	23:00	monday	monday	2025-08-04 23:01:05	3	3	1	2025-08-04	23:01	2025-08-04 23:01:10	2025-08-04 23:01:10
087fb527-3503-406b-8e5d-83dd7b13b3fd	7	9	15:00	wednesday	wednesday	2025-08-06 15:05:57	1	1	1	2025-08-06	15:05	2025-08-06 15:05:58	2025-08-06 15:05:58
b7b51fcc-c089-439e-9cb6-334fcf0d462b	7	10	15:00	wednesday	wednesday	2025-08-06 15:05:59	3	3	1	2025-08-06	15:05	2025-08-06 15:06:03	2025-08-06 15:06:03
7b114120-032a-4ee0-bbae-cab5252d72f3	8	9	16:00	wednesday	wednesday	2025-08-06 16:05:57	0	0	1	2025-08-06	16:05	2025-08-06 16:05:58	2025-08-06 16:05:58
d4032b17-497a-451d-bc37-d01ea4a12c1c	8	10	16:00	wednesday	wednesday	2025-08-06 16:05:59	2	2	1	2025-08-06	16:05	2025-08-06 16:06:03	2025-08-06 16:06:03
67f32851-e26d-458a-b54b-31fb78a626c2	9	9	17:00	wednesday	wednesday	2025-08-06 17:05:57	1	1	1	2025-08-06	17:05	2025-08-06 17:05:59	2025-08-06 17:05:59
d413cc31-165a-4d1e-9f75-aea54b163a66	9	10	17:00	wednesday	wednesday	2025-08-06 17:05:59	3	3	1	2025-08-06	17:05	2025-08-06 17:06:03	2025-08-06 17:06:03
3aec392e-cb49-4b7c-9095-527e1feb7612	10	9	18:00	wednesday	wednesday	2025-08-06 18:05:56	0	0	1	2025-08-06	18:05	2025-08-06 18:05:59	2025-08-06 18:05:59
b8746ff3-6965-4046-a265-9c08c3db95e5	10	10	18:00	wednesday	wednesday	2025-08-06 18:05:59	2	2	1	2025-08-06	18:05	2025-08-06 18:06:04	2025-08-06 18:06:04
8d41a488-afce-4365-8c08-642ea20f6c02	18	9	19:00	wednesday	wednesday	2025-08-06 19:05:56	1	1	1	2025-08-06	19:05	2025-08-06 19:05:59	2025-08-06 19:05:59
6f5507a4-fbdd-47ac-a0d3-c564f4858c72	18	10	19:00	wednesday	wednesday	2025-08-06 19:05:59	3	3	1	2025-08-06	19:05	2025-08-06 19:06:04	2025-08-06 19:06:04
a0178fc9-ef0e-49ec-9cad-98409e2514da	19	9	20:00	wednesday	wednesday	2025-08-06 20:05:55	0	0	1	2025-08-06	20:05	2025-08-06 20:05:57	2025-08-06 20:05:57
f60f5ff6-aadf-413a-a9a3-fe6c4a1f830b	19	10	20:00	wednesday	wednesday	2025-08-06 20:05:57	2	2	1	2025-08-06	20:05	2025-08-06 20:06:02	2025-08-06 20:06:02
db849510-3e06-44e6-a97a-ca2756e1b032	20	9	21:00	wednesday	wednesday	2025-08-06 21:05:55	1	1	1	2025-08-06	21:05	2025-08-06 21:05:57	2025-08-06 21:05:57
2a8f308d-315e-4105-b708-01e9b5f37245	20	10	21:00	wednesday	wednesday	2025-08-06 21:05:57	3	3	1	2025-08-06	21:05	2025-08-06 21:06:02	2025-08-06 21:06:02
ac957123-1d9d-449f-90a2-18fa50d8a630	21	9	22:00	wednesday	wednesday	2025-08-06 22:05:55	0	0	1	2025-08-06	22:05	2025-08-06 22:05:57	2025-08-06 22:05:57
d8d37f75-6088-48bb-905a-8f3a5097cf59	21	10	22:00	wednesday	wednesday	2025-08-06 22:05:57	2	2	1	2025-08-06	22:05	2025-08-06 22:06:02	2025-08-06 22:06:02
591a5b0e-08fc-4303-a4ef-f6b9c7027ae7	22	9	23:00	wednesday	wednesday	2025-08-06 23:00:55	1	1	1	2025-08-06	23:00	2025-08-06 23:00:57	2025-08-06 23:00:57
d62eafa4-77cb-4403-a722-dd105a7e898d	22	10	23:00	wednesday	wednesday	2025-08-06 23:00:57	3	3	1	2025-08-06	23:00	2025-08-06 23:01:02	2025-08-06 23:01:02
1e6e25d8-93ff-4b62-b299-2851bd90ffb2	5	9	09:00	thursday	thursday	2025-08-07 09:09:35	1	1	1	2025-08-07	09:09	2025-08-07 09:09:37	2025-08-07 09:09:37
c3cff0ff-84ef-4140-9c48-d6558404c3cf	5	10	09:00	thursday	thursday	2025-08-07 09:09:38	3	3	1	2025-08-07	09:09	2025-08-07 09:09:43	2025-08-07 09:09:43
286374dc-7b66-4101-bfdf-91939939d93c	6	9	14:00	thursday	thursday	2025-08-07 14:02:43	0	0	1	2025-08-07	14:02	2025-08-07 14:02:43	2025-08-07 14:02:43
1d11d9a5-358a-4ad0-a50f-50104f3e04c7	6	10	14:00	thursday	thursday	2025-08-07 14:02:43	2	2	1	2025-08-07	14:02	2025-08-07 14:02:48	2025-08-07 14:02:48
cebe49da-2515-4bb2-9586-0905b55afe6b	7	9	15:00	thursday	thursday	2025-08-07 15:02:42	1	1	1	2025-08-07	15:02	2025-08-07 15:02:43	2025-08-07 15:02:43
b95e2ce1-569e-4e78-8f7f-9fa4c6355976	7	10	15:00	thursday	thursday	2025-08-07 15:02:43	3	3	1	2025-08-07	15:02	2025-08-07 15:02:48	2025-08-07 15:02:48
17a11f9f-e923-457e-b75f-ec880236a412	8	9	16:00	thursday	thursday	2025-08-07 16:09:52	0	0	1	2025-08-07	16:09	2025-08-07 16:09:53	2025-08-07 16:09:53
94fcae54-76c2-4f91-b94a-eefaf6d461c2	8	10	16:00	thursday	thursday	2025-08-07 16:09:53	2	2	1	2025-08-07	16:09	2025-08-07 16:09:58	2025-08-07 16:09:58
88620e60-3b34-461b-b89e-0d9aa1ae0dc8	9	9	17:00	thursday	thursday	2025-08-07 17:09:51	1	1	1	2025-08-07	17:09	2025-08-07 17:09:53	2025-08-07 17:09:53
ecf53ec4-ac0e-474e-b811-f2bb7f358cd2	9	10	17:00	thursday	thursday	2025-08-07 17:09:53	3	3	1	2025-08-07	17:09	2025-08-07 17:09:58	2025-08-07 17:09:58
485db04a-ece8-44bd-a440-3c91a5a5e016	10	9	18:00	thursday	thursday	2025-08-07 18:08:29	0	0	1	2025-08-07	18:08	2025-08-07 18:08:33	2025-08-07 18:08:33
87c88b18-5bf8-4294-9e6e-14f3a1b0efca	10	10	18:00	thursday	thursday	2025-08-07 18:08:33	2	2	1	2025-08-07	18:08	2025-08-07 18:08:46	2025-08-07 18:08:46
ae82431d-f82a-4fab-a049-9c87ff6cbd06	18	9	19:00	thursday	thursday	2025-08-07 19:08:13	1	1	1	2025-08-07	19:08	2025-08-07 19:08:16	2025-08-07 19:08:16
79168096-4435-4c67-a984-3eb5db637179	18	10	19:00	thursday	thursday	2025-08-07 19:08:16	3	3	1	2025-08-07	19:08	2025-08-07 19:08:21	2025-08-07 19:08:21
0fde9ad2-983d-40f4-be71-df7a9e632b6e	6	9	14:00	friday	friday	2025-08-08 14:06:39	0	0	1	2025-08-08	14:06	2025-08-08 14:06:44	2025-08-08 14:06:44
6555bbff-92f1-44d9-a5b3-a8dc9b9e613f	6	10	14:00	friday	friday	2025-08-08 14:06:44	2	2	1	2025-08-08	14:06	2025-08-08 14:06:49	2025-08-08 14:06:49
9ef2a5ec-5991-462d-9895-a3afb302a0b7	7	9	15:00	friday	friday	2025-08-08 15:06:39	1	1	1	2025-08-08	15:06	2025-08-08 15:06:39	2025-08-08 15:06:39
02b75c06-4ccf-409c-b3e8-5f89f5b069e0	7	10	15:00	friday	friday	2025-08-08 15:06:39	3	3	1	2025-08-08	15:06	2025-08-08 15:06:44	2025-08-08 15:06:44
f1168b4f-6d4a-4ab9-bc22-ec0e688fac8f	18	9	19:00	friday	friday	2025-08-08 19:03:13	1	1	1	2025-08-08	19:03	2025-08-08 19:03:14	2025-08-08 19:03:14
12e6bfa7-042d-447d-a763-4312b8c9ba55	18	10	19:00	friday	friday	2025-08-08 19:03:14	3	3	1	2025-08-08	19:03	2025-08-08 19:03:19	2025-08-08 19:03:19
5fae1e6d-575b-48b3-ad6c-241a9651c7b0	19	9	20:00	friday	friday	2025-08-08 20:03:13	0	0	1	2025-08-08	20:03	2025-08-08 20:03:14	2025-08-08 20:03:14
602b4049-1aad-4e22-b3f7-6fff855d4cdd	19	10	20:00	friday	friday	2025-08-08 20:03:14	2	2	1	2025-08-08	20:03	2025-08-08 20:03:19	2025-08-08 20:03:19
dae61fac-3736-443c-beef-155ff5a137a9	6	9	14:00	saturday	saturday	2025-08-09 14:05:02	0	0	1	2025-08-09	14:05	2025-08-09 14:05:05	2025-08-09 14:05:05
58432ec0-b77d-48cd-8fd5-2a696f9fac22	6	10	14:00	saturday	saturday	2025-08-09 14:05:05	2	2	1	2025-08-09	14:05	2025-08-09 14:05:10	2025-08-09 14:05:10
4a394d98-bbb7-4bf9-9d08-07f8f29b1f1c	7	9	15:00	saturday	saturday	2025-08-09 15:05:02	1	1	1	2025-08-09	15:05	2025-08-09 15:05:05	2025-08-09 15:05:05
f6b30223-d620-4988-ba62-8fd7e1af3914	7	10	15:00	saturday	saturday	2025-08-09 15:05:05	3	3	1	2025-08-09	15:05	2025-08-09 15:05:10	2025-08-09 15:05:10
06d42e0d-ca1a-406f-8cbd-ffd65f551060	21	9	22:00	sunday	sunday	2025-08-10 22:23:47	0	0	1	2025-08-10	22:23	2025-08-10 22:23:48	2025-08-10 22:23:48
d8920fe2-ae1f-4240-b63f-0c1331c7eb96	21	10	22:00	sunday	sunday	2025-08-10 22:23:48	2	2	1	2025-08-10	22:23	2025-08-10 22:23:53	2025-08-10 22:23:53
e1c86663-5b0f-4958-9452-bf4462e6f8ce	22	9	23:00	sunday	sunday	2025-08-10 23:03:47	1	1	1	2025-08-10	23:03	2025-08-10 23:03:48	2025-08-10 23:03:48
342e2132-fc87-4c9b-a0a7-393286a647e7	22	10	23:00	sunday	sunday	2025-08-10 23:03:48	3	3	1	2025-08-10	23:03	2025-08-10 23:03:53	2025-08-10 23:03:53
f5a88a96-8080-45dc-b183-0dff4524cdf0	24	9	01:00	monday	monday	2025-08-11 01:21:45	1	1	1	2025-08-11	01:21	2025-08-11 01:21:46	2025-08-11 01:21:46
c72771ec-6db4-460f-b528-47f85141da1c	24	10	01:00	monday	monday	2025-08-11 01:21:46	3	3	1	2025-08-11	01:21	2025-08-11 01:21:51	2025-08-11 01:21:51
d0c181aa-3bae-4a92-8ab7-d32a63032e47	25	9	02:00	monday	monday	2025-08-11 02:01:44	0	0	1	2025-08-11	02:01	2025-08-11 02:01:46	2025-08-11 02:01:46
e6d85155-ab28-4bba-8fa9-5e01391049cc	6	9	14:00	monday	monday	2025-08-11 14:08:51	0	0	1	2025-08-11	14:08	2025-08-11 14:08:53	2025-08-11 14:08:53
961c0b9c-56b1-420b-900c-4667bf93f9c4	6	10	14:00	monday	monday	2025-08-11 14:08:53	2	2	1	2025-08-11	14:08	2025-08-11 14:08:58	2025-08-11 14:08:58
15719326-908c-49ef-a583-6355451a48eb	7	9	15:00	monday	monday	2025-08-11 15:08:50	1	1	1	2025-08-11	15:08	2025-08-11 15:08:53	2025-08-11 15:08:53
e5f2f5a4-0895-4725-8b68-2cf3392529f6	7	10	15:00	monday	monday	2025-08-11 15:08:53	3	3	1	2025-08-11	15:08	2025-08-11 15:08:58	2025-08-11 15:08:58
7b1f5d0b-8e56-421a-9b82-50d38254e577	8	9	16:00	monday	monday	2025-08-11 16:08:50	0	0	1	2025-08-11	16:08	2025-08-11 16:08:53	2025-08-11 16:08:53
4883663b-55a5-4e52-b01d-c9c1ca896658	8	10	16:00	monday	monday	2025-08-11 16:08:53	2	2	1	2025-08-11	16:08	2025-08-11 16:08:58	2025-08-11 16:08:58
9193c849-ae05-4c56-8cd3-148877c02a3c	9	9	17:00	monday	monday	2025-08-11 17:07:44	1	1	1	2025-08-11	17:07	2025-08-11 17:07:48	2025-08-11 17:07:48
6c43fd56-1a9c-4718-925d-fa7c1763c2ca	9	10	17:00	monday	monday	2025-08-11 17:07:48	3	3	1	2025-08-11	17:07	2025-08-11 17:07:53	2025-08-11 17:07:53
b6a9a261-3b5d-4616-bbdb-93e46cf227fd	10	9	18:00	monday	monday	2025-08-11 18:08:49	0	0	1	2025-08-11	18:08	2025-08-11 18:08:53	2025-08-11 18:08:53
85a92b9a-e6a0-487e-aa1b-60947594d6f9	10	10	18:00	monday	monday	2025-08-11 18:08:53	2	2	1	2025-08-11	18:08	2025-08-11 18:08:58	2025-08-11 18:08:58
\.


--
-- Data for Name: sd_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user (id, createddate, updateddate, deletedate, role_id, email, username, password, password_temp, firstname, lastname, fullname, nickname, idcard, lastsignindate, status, active_status, network_id, remark, infomation_agree_status, gender, birthday, online_status, message, network_type_id, public_status, type_id, avatarpath, avatar, refresh_token, loginfailed, public_notification, sms_notification, email_notification, line_notification, mobile_number, phone_number, lineid) FROM stdin;
e6f44f6a-070d-4d86-a6ff-00b0cdb2ac75	2025-07-03 02:12:27.30362	2025-07-03 02:12:27.430973	\N	2	icmon0955@gmail.com	kongnakornna	$2b$10$GJJgY7NY/dZq3GLlRc0RxOHvVWCrXBCfMRRVfZVgUWSzdxahz8TA2	Na@0955@#	\N	\N	\N	\N	\N	2025-07-03 02:12:27.30362	1	1	\N	\N	0	\N	\N	\N	Register	\N	\N	\N	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU2ZjQ0ZjZhLTA3MGQtNGQ4Ni1hNmZmLTAwYjBjZGIyYWM3NSIsImlhdCI6MTc1MTUwODc0NywiZXhwIjoxNzU0MTAwNzQ3fQ.gWHJec6WJdgBEhFpBWxiJWo-HCqwaaQ1xrAiwio4wD8	0	1	1	1	1	0955088091	0955088091	kongnakornna
fb546a59-6ade-4e48-8428-d1511831898a	2025-07-03 02:07:43.613094	2025-07-27 11:49:54	\N	3	icmon@gmail.com	icmon	$2b$10$9VsAf5kF/vfBu4WEeLmFtuCPp4Sgw9PVEN894Pg8ATSICIbsKWlLq	icmon	\N	\N	\N	\N	\N	2025-07-27 11:49:54	99	1	\N	\N	0	\N	\N	\N	system	\N	\N	\N	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiNTQ2YTU5LTZhZGUtNGU0OC04NDI4LWQxNTExODMxODk4YSIsImlhdCI6MTc1MzU5MTc5NCwiZXhwIjoxNzU2MTgzNzk0fQ.CNUTTHJ8bbvWquQsvWhEPVJ9fHhuDLD0vhPBxb926no	0	0	0	1	0	\N	\N	\N
d95b5588-3880-4f05-b661-6a111c860c5e	2025-07-03 02:11:07.414441	2025-08-07 06:52:36.548296	\N	2	alexsomsap@gmail.com	icmons	$2b$10$zJ8sWNiN7iQWDTGA9ro1b.ghE57Wcjd7MDKpzlWj/M.mXmLqIOsdu	icmons	\N	\N	\N	\N	\N	2025-07-03 02:11:07.414441	1	1	\N	\N	0	\N	\N	\N	Register	\N	\N	\N	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5NWI1NTg4LTM4ODAtNGYwNS1iNjYxLTZhMTExYzg2MGM1ZSIsImlhdCI6MTc1MTUwODY2NywiZXhwIjoxNzU0MTAwNjY3fQ.ZKDo7s4DTa6aT6Mz-vpQn3tMYR36-a4lk-Jz_Vyyv5w	0	0	1	1	0	0844387246	0844387246	alex.somsap
c9497023-f370-4355-9162-f3f019b3534b	2025-07-03 02:00:47.083775	2025-08-11 01:13:55	\N	1	monitoring.system.report@gmail.com	system	$2b$10$Ik44gWlD99nCCpCTsgn6w.eEeb2he/w.yuyG8MRGTKCh2CyAIwqu.	Na@0955@#	\N	\N	\N	\N	\N	2025-08-11 01:13:55	99	1	\N	\N	0	\N	\N	\N	system	\N	\N	\N	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5NDk3MDIzLWYzNzAtNDM1NS05MTYyLWYzZjAxOWIzNTM0YiIsImlhdCI6MTc1NDg0OTYzNSwiZXhwIjoxNzU3NDQxNjM1fQ.PxkYrM9uRNt1jM-fp1iha3LsfHkeUVI4E8ZQcaQQyhM	0	0	0	1	0	\N	\N	\N
\.


--
-- Data for Name: sd_user_access_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_access_menu (user_access_id, user_type_id, menu_id, parent_id) FROM stdin;
1	1	1	1
\.


--
-- Data for Name: sd_user_file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_file (id, file_name, file_type, file_path, file_type_id, uid, file_date, status) FROM stdin;
\.


--
-- Data for Name: sd_user_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_log (id, log_type_id, uid, name, detail, select_status, insert_status, update_status, delete_status, status, "create", update, lang) FROM stdin;
1	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignInlog	\N	\N	\N	\N	\N	2025-06-08 13:23:21.632702	2025-06-08 13:23:21.632702	en
2	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	\N	2025-06-08 14:18:44.07451	2025-06-08 14:18:44.07451	en
3	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	\N	2025-06-08 14:20:10.770695	2025-06-08 14:20:10.770695	en
4	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	\N	2025-06-08 14:20:15.627646	2025-06-08 14:20:15.627646	en
6	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	0	0	0	0	0	2025-06-08 15:05:29.343143	2025-06-08 15:05:29.343143	en
7	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	0	0	0	0	0	2025-06-08 15:06:02.411415	2025-06-08 15:06:02.411415	en
8	2	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-08 15:16:12.758734	2025-06-08 15:16:12.758734	en
9	2	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 01:37:13.008581	2025-06-09 01:37:13.008581	en
10	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 01:38:53.161341	2025-06-09 01:38:53.161341	en
11	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 01:52:53.207609	2025-06-09 01:52:53.207609	en
12	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:05:02.622974	2025-06-09 02:05:02.622974	en
13	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:13:56.708169	2025-06-09 02:13:56.708169	en
14	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:14:23.063863	2025-06-09 02:14:23.063863	en
15	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:16:50.299452	2025-06-09 02:16:50.299452	en
16	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:23:58.988425	2025-06-09 02:23:58.988425	en
17	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:30:24.662391	2025-06-09 02:30:24.662391	en
18	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-09 02:35:18.97184	2025-06-09 02:35:18.97184	en
19	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 02:35:31.686166	2025-06-09 02:35:31.686166	en
20	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 02:36:45.676461	2025-06-09 02:36:45.676461	en
21	1	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	1	2025-06-09 02:42:35.005829	2025-06-09 02:42:35.005829	en
22	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 02:43:52.483117	2025-06-09 02:43:52.483117	en
23	1	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-09 02:44:11.988224	2025-06-09 02:44:11.988224	en
24	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 02:47:25.108984	2025-06-09 02:47:25.108984	en
25	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-09 02:47:58.084719	2025-06-09 02:47:58.084719	en
26	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 02:49:06.303646	2025-06-09 02:49:06.303646	en
27	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-09 03:32:33.324219	2025-06-09 03:32:33.324219	en
28	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-09 03:33:06.427718	2025-06-09 03:33:06.427718	en
5	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	1	1	1	1	1	2025-06-08 15:05:20.801815	2025-06-08 15:05:20.801815	en
29	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-13 04:45:22.515911	2025-06-13 04:45:22.515911	en
30	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-13 04:47:54.183369	2025-06-13 04:47:54.183369	en
31	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-13 06:02:00.996482	2025-06-13 06:02:00.996482	en
32	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-13 06:02:06.237436	2025-06-13 06:02:06.237436	en
33	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-13 06:02:08.018786	2025-06-13 06:02:08.018786	en
34	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-13 06:02:09.106474	2025-06-13 06:02:09.106474	en
35	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-13 06:02:16.750722	2025-06-13 06:02:16.750722	en
36	1	ea5a0dfa-7bda-4223-9e82-9d9684503e0a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 05:20:01.389462	2025-06-14 05:20:01.389462	en
37	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 05:41:39.280777	2025-06-14 05:41:39.280777	en
38	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 05:56:24.801694	2025-06-14 05:56:24.801694	en
39	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-14 06:03:47.786226	2025-06-14 06:03:47.786226	en
40	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 06:04:13.045998	2025-06-14 06:04:13.045998	en
41	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 06:19:46.432852	2025-06-14 06:19:46.432852	en
42	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 12:38:11.960985	2025-06-14 12:38:11.960985	en
43	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 14:25:14.59842	2025-06-14 14:25:14.59842	en
44	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-14 16:58:20.88603	2025-06-14 16:58:20.88603	en
45	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 03:54:11.452739	2025-06-15 03:54:11.452739	th
46	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 04:13:20.753444	2025-06-15 04:13:20.753444	en
47	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 04:13:28.560062	2025-06-15 04:13:28.560062	en
48	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 04:41:36.211462	2025-06-15 04:41:36.211462	en
49	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 12:12:19.899969	2025-06-15 12:12:19.899969	en
50	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-15 12:17:19.249796	2025-06-15 12:17:19.249796	en
51	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-15 19:40:28.469426	2025-06-15 19:40:28.469426	en
52	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-16 01:46:46.581004	2025-06-16 01:46:46.581004	en
53	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-16 06:17:08.13667	2025-06-16 06:17:08.13667	en
54	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-16 14:39:18.914406	2025-06-16 14:39:18.914406	en
55	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-17 01:33:51.027381	2025-06-17 01:33:51.027381	en
56	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 03:35:14.261547	2025-06-17 03:35:14.261547	en
57	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 07:13:51.932416	2025-06-17 07:13:51.932416	en
58	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 17:05:34.014432	2025-06-17 17:05:34.014432	en
59	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 18:28:31.987564	2025-06-17 18:28:31.987564	en
60	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 20:37:57.868425	2025-06-17 20:37:57.868425	en
61	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-17 20:53:08.688658	2025-06-17 20:53:08.688658	en
62	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 02:18:17.482604	2025-06-18 02:18:17.482604	en
63	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 02:38:56.494021	2025-06-18 02:38:56.494021	en
64	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 03:09:31.884603	2025-06-18 03:09:31.884603	en
65	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 03:57:10.702604	2025-06-18 03:57:10.702604	en
66	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 07:50:22.893444	2025-06-18 07:50:22.893444	en
67	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-18 08:26:05.749056	2025-06-18 08:26:05.749056	en
68	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 08:30:43.67409	2025-06-18 08:30:43.67409	en
69	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-18 12:44:47.218425	2025-06-18 12:44:47.218425	en
70	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-18 12:44:48.187925	2025-06-18 12:44:48.187925	en
71	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-18 12:44:48.884199	2025-06-18 12:44:48.884199	en
72	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	0	0	0	0	0	2025-06-18 12:46:12.27428	2025-06-18 12:46:12.27428	en
73	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-18 12:55:03.978746	2025-06-18 12:55:03.978746	en
74	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-19 09:57:24.518207	2025-06-19 09:57:24.518207	en
75	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-19 18:26:18.837463	2025-06-19 18:26:18.837463	en
76	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-21 04:02:04.626414	2025-06-21 04:02:04.626414	en
77	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 10:06:14.365358	2025-06-22 10:06:14.365358	en
78	1	e0076094-ec42-41ca-a39d-543999c7bbf6	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 11:27:32.817555	2025-06-22 11:27:32.817555	en
79	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 13:04:39.167339	2025-06-22 13:04:39.167339	en
80	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 15:11:22.696883	2025-06-22 15:11:22.696883	en
81	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 15:11:28.61057	2025-06-22 15:11:28.61057	en
82	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-22 18:39:10.072138	2025-06-22 18:39:10.072138	en
83	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 18:41:19.295056	2025-06-22 18:41:19.295056	en
84	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-22 18:41:54.400949	2025-06-22 18:41:54.400949	en
85	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 18:43:34.410747	2025-06-22 18:43:34.410747	en
86	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-22 19:04:33.318941	2025-06-22 19:04:33.318941	en
87	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 19:20:55.311999	2025-06-22 19:20:55.311999	en
88	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 20:26:25.82774	2025-06-22 20:26:25.82774	en
89	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-22 20:34:44.181966	2025-06-22 20:34:44.181966	en
90	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-22 20:35:40.340906	2025-06-22 20:35:40.340906	en
91	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-23 02:43:45.163666	2025-06-23 02:43:45.163666	en
92	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-23 03:16:39.397405	2025-06-23 03:16:39.397405	en
93	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-23 03:29:41.31101	2025-06-23 03:29:41.31101	en
94	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-23 14:25:52.178634	2025-06-23 14:25:52.178634	en
95	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-23 14:43:32.65041	2025-06-23 14:43:32.65041	en
96	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-23 15:16:56.682087	2025-06-23 15:16:56.682087	en
97	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-23 15:18:40.075581	2025-06-23 15:18:40.075581	en
98	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-25 00:20:09.726513	2025-06-25 00:20:09.726513	en
99	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-25 00:34:46.591601	2025-06-25 00:34:46.591601	en
100	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-26 03:59:44.311329	2025-06-26 03:59:44.311329	en
101	1	e0076094-ec42-41ca-a39d-543999c7bbf6	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-26 08:22:51.837932	2025-06-26 08:22:51.837932	en
102	2	e0076094-ec42-41ca-a39d-543999c7bbf6	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-26 08:26:13.982227	2025-06-26 08:26:13.982227	en
103	1	e0076094-ec42-41ca-a39d-543999c7bbf6	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-26 08:26:36.138469	2025-06-26 08:26:36.138469	en
104	2	e0076094-ec42-41ca-a39d-543999c7bbf6	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-26 20:47:10.29763	2025-06-26 20:47:10.29763	en
137	1	ab670ab2-3b45-4059-9a39-87c72d4d6f1c	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-27 03:57:28.225656	2025-06-27 03:57:28.225656	en
138	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-27 04:43:57.568418	2025-06-27 04:43:57.568418	en
139	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-27 08:08:45.661336	2025-06-27 08:08:45.661336	en
140	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-27 18:57:46.48131	2025-06-27 18:57:46.48131	en
141	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-27 19:23:22.134898	2025-06-27 19:23:22.134898	en
142	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-27 19:24:23.858652	2025-06-27 19:24:23.858652	en
143	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-28 04:56:31.724718	2025-06-28 04:56:31.724718	en
144	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-29 03:14:58.502038	2025-06-29 03:14:58.502038	en
145	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-29 12:46:04.267225	2025-06-29 12:46:04.267225	en
146	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-29 15:04:40.177936	2025-06-29 15:04:40.177936	en
147	2	3a493e74-cdc3-4060-8db2-220463a80f20	User Signout	User Signout log	\N	\N	\N	\N	2	2025-06-29 17:31:09.624915	2025-06-29 17:31:09.624915	en
148	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-06-29 17:31:45.368499	2025-06-29 17:31:45.368499	en
2	1	3a493e74-cdc3-4060-8db2-220463a80f20	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-02 09:39:40.350833	2025-07-02 09:39:40.350833	en
4	1	fb546a59-6ade-4e48-8428-d1511831898a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-03 02:09:24.237288	2025-07-03 02:09:24.237288	en
6	1	fb546a59-6ade-4e48-8428-d1511831898a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-03 02:15:01.557488	2025-07-03 02:15:01.557488	en
8	1	fb546a59-6ade-4e48-8428-d1511831898a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-03 03:44:56.429532	2025-07-03 03:44:56.429532	en
9	1	fb546a59-6ade-4e48-8428-d1511831898a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-03 13:22:45.93739	2025-07-03 13:22:45.93739	en
10	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-03 13:46:29.359182	2025-07-03 13:46:29.359182	en
12	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-03 16:59:17.320721	2025-07-03 16:59:17.320721	en
46	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-04 17:06:31.306589	2025-07-04 17:06:31.306589	th
84	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-05 12:13:31.174277	2025-07-05 12:13:31.174277	en
86	1	fb546a59-6ade-4e48-8428-d1511831898a	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-06 09:16:44.055167	2025-07-06 09:16:44.055167	en
89	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-09 08:25:52.413807	2025-07-09 08:25:52.413807	en
122	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-09 10:35:55.807228	2025-07-09 10:35:55.807228	en
123	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-09 21:34:21.823733	2025-07-09 21:34:21.823733	en
124	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-10 15:24:04.147185	2025-07-10 15:24:04.147185	en
125	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-10 15:24:27.509603	2025-07-10 15:24:27.509603	en
126	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-10 16:07:24.915985	2025-07-10 16:07:24.915985	en
127	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-10 16:49:24.725458	2025-07-10 16:49:24.725458	en
128	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-10 16:49:57.27406	2025-07-10 16:49:57.27406	en
129	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 02:58:53.860808	2025-07-11 02:58:53.860808	en
130	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 04:33:21.896344	2025-07-11 04:33:21.896344	en
131	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 13:00:31.489329	2025-07-11 13:00:31.489329	en
132	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 13:40:33.050257	2025-07-11 13:40:33.050257	en
133	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 15:32:25.516737	2025-07-11 15:32:25.516737	en
134	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 18:07:15.618231	2025-07-11 18:07:15.618231	en
135	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 18:10:21.332961	2025-07-11 18:10:21.332961	en
136	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-11 18:12:47.74835	2025-07-11 18:12:47.74835	en
139	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-12 11:23:05.457963	2025-07-12 11:23:05.457963	en
141	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-13 02:52:54.964086	2025-07-13 02:52:54.964086	en
1	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-18 06:43:15.239089	2025-07-18 06:43:15.239089	en
38	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-20 10:20:44.077849	2025-07-20 10:20:44.077849	en
39	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-20 10:24:28.884431	2025-07-20 10:24:28.884431	en
40	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-20 10:27:13.927756	2025-07-20 10:27:13.927756	en
42	2	fb546a59-6ade-4e48-8428-d1511831898a	User Signout	User Signout log	\N	\N	\N	\N	2	2025-07-22 19:47:11.191321	2025-07-22 19:47:11.191321	en
51	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-07-27 05:19:48.070267	2025-07-27 05:19:48.070267	en
67	1	c9497023-f370-4355-9162-f3f019b3534b	User SignIn	User SignIn log	\N	\N	\N	\N	1	2025-08-10 04:34:35.997513	2025-08-10 04:34:35.997513	en
70	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-08-10 07:04:09.266937	2025-08-10 07:04:09.266937	en
72	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-08-10 07:17:49.590861	2025-08-10 07:17:49.590861	en
74	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-08-10 07:21:39.047492	2025-08-10 07:21:39.047492	en
76	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-08-10 07:25:07.88108	2025-08-10 07:25:07.88108	en
80	2	c9497023-f370-4355-9162-f3f019b3534b	User Signout	User Signout log	\N	\N	\N	\N	2	2025-08-10 08:22:27.110857	2025-08-10 08:22:27.110857	en
\.


--
-- Data for Name: sd_user_log_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_log_type (log_type_id, type_name, type_detail, status, "create", update) FROM stdin;
\.


--
-- Data for Name: sd_user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_role (id, role_id, title, createddate, updateddate, create_by, lastupdate_by, status, type_id, lang) FROM stdin;
1	1	Dev	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
2	2	Administrator	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
3	3	Company	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
4	4	Staff	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
5	5	Helpdask	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
6	6	Customer	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
7	7	Donate	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
8	8	Edittor	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
9	9	User	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
10	10	gaust	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	en
11	1	Dev	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
12	2	Administrator	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
13	3	Company	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
14	4	Staff	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
15	5	Helpdask	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
16	6	Customer	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
17	7	Donate	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
18	8	Edittor	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
19	9	User	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
20	10	gaust	2025-04-06 20:56:00.301605	2025-04-06 20:56:00.301605	1	1	1	1	th
\.


--
-- Data for Name: sd_user_roles_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_roles_access ("create", update, role_id, role_type_id) FROM stdin;
2021-05-05 09:23:46	2021-05-05 09:23:48	1	1
2023-05-01 17:50:20	2023-05-01 17:50:25	2	2
2023-05-01 17:50:59	2023-05-01 17:51:03	3	3
2023-05-01 17:51:13	2023-05-01 17:51:15	4	4
2023-05-01 17:51:23	2023-05-01 17:51:25	5	5
2023-05-01 17:51:31	2023-05-01 17:51:34	5	6
\.


--
-- Data for Name: sd_user_roles_permision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sd_user_roles_permision (role_type_id, name, detail, created, updated, insert, update, delete, "select", log, config, truncate) FROM stdin;
1	System Admin	All	2021-05-05 09:23:32	2021-05-05 09:23:33	1	1	1	1	1	1	1
2	Admin Level	Admin access	2021-05-09 19:52:04	2021-05-09 19:52:09	1	1	1	1	1	0	0
3	Customer Level	Customer access	2021-05-09 19:52:30	2021-05-09 19:52:32	1	1	0	1	1	0	0
\.


--
-- Name: sd_admin_access_menu_admin_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_admin_access_menu_admin_access_id_seq', 1, false);


--
-- Name: sd_admin_access_menu_admin_access_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_admin_access_menu_admin_access_id_seq1', 1, false);


--
-- Name: sd_admin_access_menu_admin_access_id_seq2; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_admin_access_menu_admin_access_id_seq2', 1, false);


--
-- Name: sd_device_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_device_log_id_seq', 1, false);


--
-- Name: sd_iot_api_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_api_api_id_seq', 1, false);


--
-- Name: sd_iot_device_action_device_action_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_action_device_action_user_id_seq', 33, true);


--
-- Name: sd_iot_device_action_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_action_log_log_id_seq', 1, false);


--
-- Name: sd_iot_device_action_user_device_action_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_action_user_device_action_user_id_seq', 1, false);


--
-- Name: sd_iot_device_alarm_action_alarm_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_alarm_action_alarm_action_id_seq', 73, true);


--
-- Name: sd_iot_device_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq', 1, false);


--
-- Name: sd_iot_device_device_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq1', 13, true);


--
-- Name: sd_iot_device_device_id_seq2; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq2', 1, false);


--
-- Name: sd_iot_device_device_id_seq3; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq3', 16, true);


--
-- Name: sd_iot_device_device_id_seq4; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq4', 103, true);


--
-- Name: sd_iot_device_device_id_seq5; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq5', 1, false);


--
-- Name: sd_iot_device_device_id_seq6; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_device_id_seq6', 66, true);


--
-- Name: sd_iot_device_type_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_device_type_type_id_seq', 1, false);


--
-- Name: sd_iot_email_email_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_email_email_id_seq', 1, true);


--
-- Name: sd_iot_email_email_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_email_email_id_seq1', 1, false);


--
-- Name: sd_iot_email_host_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_email_host_id_seq', 1, false);


--
-- Name: sd_iot_email_host_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_email_host_id_seq1', 1, false);


--
-- Name: sd_iot_group_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_group_group_id_seq', 1, false);


--
-- Name: sd_iot_group_group_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_group_group_id_seq1', 1, false);


--
-- Name: sd_iot_influxdb_influxdb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_influxdb_influxdb_id_seq', 1, false);


--
-- Name: sd_iot_line_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_line_line_id_seq', 1, false);


--
-- Name: sd_iot_location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_location_location_id_seq', 1, false);


--
-- Name: sd_iot_location_location_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_location_location_id_seq1', 1, false);


--
-- Name: sd_iot_mqtt_mqtt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq', 17, true);


--
-- Name: sd_iot_mqtt_mqtt_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq1', 1, false);


--
-- Name: sd_iot_mqtt_mqtt_id_seq2; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq2', 1, false);


--
-- Name: sd_iot_mqtt_mqtt_id_seq3; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq3', 1, false);


--
-- Name: sd_iot_mqtt_mqtt_id_seq4; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq4', 88, true);


--
-- Name: sd_iot_mqtt_mqtt_id_seq5; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq5', 1, false);


--
-- Name: sd_iot_mqtt_mqtt_id_seq6; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_mqtt_mqtt_id_seq6', 1, false);


--
-- Name: sd_iot_nodered_nodered_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_nodered_nodered_id_seq', 1, false);


--
-- Name: sd_iot_schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_schedule_schedule_id_seq', 25, true);


--
-- Name: sd_iot_sensor_sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_sensor_sensor_id_seq', 1, false);


--
-- Name: sd_iot_sensor_sensor_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_sensor_sensor_id_seq1', 1, false);


--
-- Name: sd_iot_setting_setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_setting_setting_id_seq', 1, false);


--
-- Name: sd_iot_setting_setting_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_setting_setting_id_seq1', 1, false);


--
-- Name: sd_iot_sms_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_sms_sms_id_seq', 1, false);


--
-- Name: sd_iot_telegram_telegram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_telegram_telegram_id_seq', 1, false);


--
-- Name: sd_iot_token_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_token_token_id_seq', 1, false);


--
-- Name: sd_iot_type_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_type_type_id_seq', 1, true);


--
-- Name: sd_iot_type_type_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_iot_type_type_id_seq1', 1, false);


--
-- Name: sd_user_access_menu_user_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_access_menu_user_access_id_seq', 1, false);


--
-- Name: sd_user_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_file_id_seq', 1, false);


--
-- Name: sd_user_file_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_file_id_seq1', 1, false);


--
-- Name: sd_user_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_log_id_seq', 86, true);


--
-- Name: sd_user_log_type_log_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_log_type_log_type_id_seq', 1, false);


--
-- Name: sd_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sd_user_role_id_seq', 1, false);


--
-- Name: sd_iot_telegram PK_08af27f615221874350bf2bf792; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_telegram
    ADD CONSTRAINT "PK_08af27f615221874350bf2bf792" PRIMARY KEY (telegram_id);


--
-- Name: sd_iot_type PK_1047517b57c47c748f0b71a4105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_type
    ADD CONSTRAINT "PK_1047517b57c47c748f0b71a4105" PRIMARY KEY (type_id);


--
-- Name: sd_iot_device_action_log PK_18e2a97db2a742f43c79aba5e2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device_action_log
    ADD CONSTRAINT "PK_18e2a97db2a742f43c79aba5e2c" PRIMARY KEY (log_id);


--
-- Name: sd_iot_alarm_device_event PK_25f5163f34e3ba4824c5b5a2a20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_alarm_device_event
    ADD CONSTRAINT "PK_25f5163f34e3ba4824c5b5a2a20" PRIMARY KEY (id);


--
-- Name: sd_iot_device_alarm_action PK_263a057ba286325ecfadbf7d659; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device_alarm_action
    ADD CONSTRAINT "PK_263a057ba286325ecfadbf7d659" PRIMARY KEY (alarm_action_id);


--
-- Name: sd_iot_schedule PK_380784b437a7a4f03489497dbef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_schedule
    ADD CONSTRAINT "PK_380784b437a7a4f03489497dbef" PRIMARY KEY (schedule_id);


--
-- Name: sd_alarm_process_log_email PK_3dd863b3d0b87eb1065f899d41e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log_email
    ADD CONSTRAINT "PK_3dd863b3d0b87eb1065f899d41e" PRIMARY KEY (id);


--
-- Name: sd_user_log_type PK_3f8b97a85e0528d6c18c4fd20b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_log_type
    ADD CONSTRAINT "PK_3f8b97a85e0528d6c18c4fd20b3" PRIMARY KEY (log_type_id);


--
-- Name: sd_alarm_process_log_temp PK_432d1e132ee5b3c7279ffd75c84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log_temp
    ADD CONSTRAINT "PK_432d1e132ee5b3c7279ffd75c84" PRIMARY KEY (id);


--
-- Name: sd_schedule_process_log PK_43d2cfd6e887bfb6dd522e78465; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_schedule_process_log
    ADD CONSTRAINT "PK_43d2cfd6e887bfb6dd522e78465" PRIMARY KEY (id);


--
-- Name: sd_iot_device_action_user PK_46ce2368b97b8d88ad749ff3f7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device_action_user
    ADD CONSTRAINT "PK_46ce2368b97b8d88ad749ff3f7a" PRIMARY KEY (device_action_user_id);


--
-- Name: sd_user_roles_permision PK_4df7386cc58a6712f2bef59c507; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_roles_permision
    ADD CONSTRAINT "PK_4df7386cc58a6712f2bef59c507" PRIMARY KEY (role_type_id);


--
-- Name: sd_iot_nodered PK_5955209b50a4dac0a439790f161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_nodered
    ADD CONSTRAINT "PK_5955209b50a4dac0a439790f161" PRIMARY KEY (nodered_id);


--
-- Name: sd_iot_email PK_63215aa6e2f4e97a7fe631e9fd5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_email
    ADD CONSTRAINT "PK_63215aa6e2f4e97a7fe631e9fd5" PRIMARY KEY (email_id);


--
-- Name: sd_iot_sensor PK_6fc823992a8c07c5f40113f3e12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_sensor
    ADD CONSTRAINT "PK_6fc823992a8c07c5f40113f3e12" PRIMARY KEY (sensor_id);


--
-- Name: sd_iot_line PK_7a6a9f138ca9a811e345e59d146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_line
    ADD CONSTRAINT "PK_7a6a9f138ca9a811e345e59d146" PRIMARY KEY (line_id);


--
-- Name: sd_iot_mqtt PK_7e9215a0c1ac3510c3f8c6ea292; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_mqtt
    ADD CONSTRAINT "PK_7e9215a0c1ac3510c3f8c6ea292" PRIMARY KEY (mqtt_id);


--
-- Name: sd_iot_host PK_83184ad44ec9393718f3cda4081; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_host
    ADD CONSTRAINT "PK_83184ad44ec9393718f3cda4081" PRIMARY KEY (host_id);


--
-- Name: sd_iot_device PK_841e36ab4b8edbaa5363d65f18d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device
    ADD CONSTRAINT "PK_841e36ab4b8edbaa5363d65f18d" PRIMARY KEY (device_id);


--
-- Name: sd_user_log PK_87948a0ccfe3a88ef1e79914b00; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_log
    ADD CONSTRAINT "PK_87948a0ccfe3a88ef1e79914b00" PRIMARY KEY (id, log_type_id);


--
-- Name: sd_alarm_process_log_line PK_99daf9a12a11f25f7320bbbbb3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log_line
    ADD CONSTRAINT "PK_99daf9a12a11f25f7320bbbbb3a" PRIMARY KEY (id);


--
-- Name: sd_iot_device_action PK_a146554159a27494fd0c4cb0414; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device_action
    ADD CONSTRAINT "PK_a146554159a27494fd0c4cb0414" PRIMARY KEY (device_action_user_id);


--
-- Name: sd_user_access_menu PK_b08610dd9113be8c7df7774dbc8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_access_menu
    ADD CONSTRAINT "PK_b08610dd9113be8c7df7774dbc8" PRIMARY KEY (user_access_id);


--
-- Name: sd_iot_group PK_b0ae5d1b99f0d240d56dc942b7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_group
    ADD CONSTRAINT "PK_b0ae5d1b99f0d240d56dc942b7a" PRIMARY KEY (group_id);


--
-- Name: sd_iot_schedule_device PK_bcb83b896d2e0b92b2a019b09de; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_schedule_device
    ADD CONSTRAINT "PK_bcb83b896d2e0b92b2a019b09de" PRIMARY KEY (id);


--
-- Name: sd_user_file PK_bee867c384da15706056a6d4d79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_file
    ADD CONSTRAINT "PK_bee867c384da15706056a6d4d79" PRIMARY KEY (id);


--
-- Name: sd_alarm_process_log PK_bf05866d307414aca1cb0fa22bb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log
    ADD CONSTRAINT "PK_bf05866d307414aca1cb0fa22bb" PRIMARY KEY (id);


--
-- Name: sd_iot_token PK_c3868ec03fed99f843e31ad977c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_token
    ADD CONSTRAINT "PK_c3868ec03fed99f843e31ad977c" PRIMARY KEY (token_id);


--
-- Name: sd_iot_location PK_c56a6e8e084b1bc520fc82d8ade; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_location
    ADD CONSTRAINT "PK_c56a6e8e084b1bc520fc82d8ade" PRIMARY KEY (location_id);


--
-- Name: sd_user PK_c804add3ec6e26d0bb85dd4b5b6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user
    ADD CONSTRAINT "PK_c804add3ec6e26d0bb85dd4b5b6" PRIMARY KEY (id);


--
-- Name: sd_user_role PK_ce286bbce9874c345c85ba7c6e4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_role
    ADD CONSTRAINT "PK_ce286bbce9874c345c85ba7c6e4" PRIMARY KEY (id);


--
-- Name: sd_iot_influxdb PK_d6f4a4dc78c43ddaab90a832f2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_influxdb
    ADD CONSTRAINT "PK_d6f4a4dc78c43ddaab90a832f2f" PRIMARY KEY (influxdb_id);


--
-- Name: sd_device_log PK_da44052006daebc229cb1a64d27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_device_log
    ADD CONSTRAINT "PK_da44052006daebc229cb1a64d27" PRIMARY KEY (id, type_id, sensor_id);


--
-- Name: sd_alarm_process_log_sms PK_dc2d76655ef76ef973dbc496e12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log_sms
    ADD CONSTRAINT "PK_dc2d76655ef76ef973dbc496e12" PRIMARY KEY (id);


--
-- Name: sd_admin_access_menu PK_de95e99df0393960300a40f29ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_admin_access_menu
    ADD CONSTRAINT "PK_de95e99df0393960300a40f29ce" PRIMARY KEY (admin_access_id);


--
-- Name: sd_user_roles_access PK_ea1374b87e00872215780b096f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_user_roles_access
    ADD CONSTRAINT "PK_ea1374b87e00872215780b096f7" PRIMARY KEY (role_id, role_type_id);


--
-- Name: sd_iot_alarm_device PK_f25b128c3c65fcb6c16627e3c15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_alarm_device
    ADD CONSTRAINT "PK_f25b128c3c65fcb6c16627e3c15" PRIMARY KEY (id);


--
-- Name: sd_iot_sms PK_f4546266bbae472c27c3476edb0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_sms
    ADD CONSTRAINT "PK_f4546266bbae472c27c3476edb0" PRIMARY KEY (sms_id);


--
-- Name: sd_iot_api PK_f5a38da6c7393c8189d8aecba78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_api
    ADD CONSTRAINT "PK_f5a38da6c7393c8189d8aecba78" PRIMARY KEY (api_id);


--
-- Name: sd_alarm_process_log_telegram PK_f708fcbb8c72eaae09f83713033; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_alarm_process_log_telegram
    ADD CONSTRAINT "PK_f708fcbb8c72eaae09f83713033" PRIMARY KEY (id);


--
-- Name: sd_iot_device_type PK_f89dccdad875b086b9167167bb9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_device_type
    ADD CONSTRAINT "PK_f89dccdad875b086b9167167bb9" PRIMARY KEY (type_id);


--
-- Name: sd_iot_setting PK_fdf8830bacecfa04143cbf0ce89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_iot_setting
    ADD CONSTRAINT "PK_fdf8830bacecfa04143cbf0ce89" PRIMARY KEY (setting_id);


--
-- Name: sd_mqtt_host sd_mqtt_host_copy1_copy1_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sd_mqtt_host
    ADD CONSTRAINT sd_mqtt_host_copy1_copy1_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

