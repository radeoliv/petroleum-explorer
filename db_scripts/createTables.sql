-- Database: dbpetroleum
-- Owner: postgres
-- Password: admin123

CREATE TABLE wells (
	w_id					serial UNIQUE PRIMARY KEY,
	w_uwi					varchar(19) NOT NULL,
	w_name					varchar(100),
	w_drillers_total_depth	double precision,
	w_operator				varchar(100),
	w_current_status		varchar(100),
	w_province				varchar(20),
	w_class					varchar(100),
	w_bottom_lng			double precision,
	w_bottom_lat			double precision,
	w_top_lng				double precision,
	w_top_lat				double precision
);

CREATE TABLE status (
	s_id		serial UNIQUE PRIMARY KEY,
	w_id		int REFERENCES wells(w_id) ON DELETE CASCADE,
	s_status	varchar(50),
	s_date		date
);

CREATE TABLE injection(
	i_id		serial UNIQUE PRIMARY KEY,
	w_id		int REFERENCES wells(w_id) ON DELETE CASCADE,
	i_month		smallint,
	i_year		smallint,
	i_prod_type	varchar(20),
	i_value		double precision
);

CREATE TABLE production(
	p_id					serial UNIQUE PRIMARY KEY,
	w_id					int REFERENCES wells(w_id) ON DELETE CASCADE,
	p_cml_hours				int,
	p_cml_gas				double precision,
	p_cml_oil_bitu			double precision,
	p_cml_water				double precision,
	p_hours					int,
	p_gas					double precision,
	p_gas_act_day			double precision,
	p_gas_cal_day			double precision,
	p_gas_fluid_ratio		double precision,
	p_gas_oil_ratio			double precision,
	p_oil					double precision,
	p_oil_act_day			double precision,
	p_oil_cal_day			double precision,
	p_oil_cut				double precision,
	p_water					double precision,
	p_water_act_day			double precision,
	p_water_cal_day			double precision,
	p_water_cut				double precision,
	p_water_gas_ratio		double precision,
	p_water_oil_ratio		double precision,
	p_total_fluid			double precision,
	p_total_fluid_act_day	double precision,
	p_total_fluid_cal_day	double precision,
	p_month					smallint,
	p_year					smallint
);