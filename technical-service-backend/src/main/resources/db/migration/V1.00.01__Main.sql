CREATE TABLE users (
    login CHARACTER VARYING NOT NULL,
    password_hash CHARACTER VARYING NOT NULL,
    first_name CHARACTER VARYING,
    middle_name CHARACTER VARYING,
    last_name CHARACTER VARYING,
    role CHARACTER VARYING NOT NULL
);

CREATE TABLE device (
    id CHARACTER VARYING NOT NULL,
    name CHARACTER VARYING NOT NULL,
    serial_number CHARACTER VARYING,
    description CHARACTER VARYING
);

CREATE TABLE request (
    id CHARACTER VARYING NOT NULL,
    status CHARACTER VARYING NOT NULL,
    contact_info CHARACTER VARYING NOT NULL,
    device_id CHARACTER VARYING,
    problem_description CHARACTER VARYING,
    resolve_description CHARACTER VARYING,
    created_timestamp TIMESTAMP,
    updated_timestamp TIMESTAMP,
    created_by CHARACTER VARYING,
    updated_by CHARACTER VARYING
);

ALTER TABLE users
    ADD CONSTRAINT user_login_pk PRIMARY KEY (login);

ALTER TABLE device
    ADD CONSTRAINT device_pk PRIMARY KEY (id);

ALTER TABLE request
    ADD CONSTRAINT request_pk PRIMARY KEY (id);

ALTER TABLE request
    ADD CONSTRAINT device_id_fkey FOREIGN KEY (device_id) REFERENCES device(id);


INSERT INTO public.users(
	login, password_hash, first_name, middle_name, last_name, role)
	VALUES ('admin', '$2a$10$c2zzHAz1G1mT.KsWgO0tbeVLGp72vTMmDgzYUeXMAghZOKLlgNOTi', NULL, NULL, NULL, 'ADMIN');