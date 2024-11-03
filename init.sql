DROP SCHEMA IF EXISTS chlng_dev CASCADE;

CREATE SCHEMA chlng_dev;

CREATE TABLE chlng_dev.target_audience (
    target_audience_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE chlng_dev.customer_satisfaction_survey (
    customer_satisfaction_survey_id UUID PRIMARY KEY,
    target_audience_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    max_rating INTEGER NOT NULL,
    contact_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT fk_target_audience FOREIGN KEY (target_audience_id) REFERENCES chlng_dev.target_audience(target_audience_id) ON DELETE CASCADE
);

CREATE TABLE chlng_dev.customer_satisfaction_survey_answer (
    customer_satisfaction_survey_answer_id UUID PRIMARY KEY,
    customer_satisfaction_survey_id UUID NOT NULL,
    feedback VARCHAR(250),
    rating INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_customer_satisfaction_survey_id FOREIGN KEY (customer_satisfaction_survey_id) REFERENCES chlng_dev.customer_satisfaction_survey(customer_satisfaction_survey_id) ON DELETE CASCADE
);

insert into
    chlng_dev.target_audience (
        target_audience_id,
        name,
        description
    )
values
    (
        gen_random_uuid(),
        'Geeks e Nerds',
        'Pessoas interessadas em tecnologia, ficção científica e cultura geek.'
    ),
    (
        gen_random_uuid(),
        'Minimalistas',
        'Pessoas que buscam uma vida simplificada e com menos consumo.'
    ),
    (
        gen_random_uuid(),
        'Atletas',
        'Pessoas que praticam esportes regularmente e focam em performance física.'
    ),
    (
        gen_random_uuid(),
        'Esportistas',
        'Pessoas interessadas em atividades físicas, mas de forma mais recreativa.'
    )