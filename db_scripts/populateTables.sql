-- Database: dbpetroleum
-- Owner: postgres
-- Password: admin123

--INSERT INTO products (product_no, name, price) VALUES
    --(1, 'Cheese', 9.99),
    --(2, 'Bread', 1.99),
    --(3, 'Milk', 2.99);


INSERT INTO wells (w_uwi, w_name, w_drillers_total_depth, w_operator,
	w_current_status, w_province, w_class, w_sur_lat, w_lat_deg, w_lat_dms,
	w_lng_deg, w_lng_dms, w_sur_lng) VALUES
	();
-- Add the data inside parenthesis.

INSERT INTO status(w_id, s_status, s_date) VALUES
	();
-- Add the data inside parenthesis. The w_id must match the ones in wells.

INSERT INTO injection (w_id, i_month, i_year, i_prod_type, i_value) VALUES
	();
-- Add the data inside parenthesis. The w_id must match the ones in wells.

INSERT INTO production (w_id, p_cml_hours, p_cml_gas, p_cml_oil_bitu, p_cml_water, p_gas, p_gas_act_day, p_gas_cal_day, p_gas_fluid_ratio,
	p_gas_oil_ratio, p_hours, p_last_three_fluid, p_last_three_oil_cut, p_oil_act_day, p_oil, p_oil_cal_day, p_oil_cut, p_total_fluid, 
	p_total_fluid_act_day, p_total_fluid_cal_day, p_water, p_water_act_day, p_water_cal_day, p_water_cut, p_water_gas_ratio, p_water_oil_ratio,
	p_month, p_year) VALUES
	();
-- Add the data inside parenthesis. The w_id must match the ones in wells.