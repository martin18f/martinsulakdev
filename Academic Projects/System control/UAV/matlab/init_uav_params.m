% -----------------------------
% Physical constants
% -----------------------------
m = 0.9928;          % UAV mass [kg]
g = 9.81;            % gravitational acceleration [m/s^2]
L = 0.24;            % arm length [m]

% -----------------------------
% Moments of inertia
% -----------------------------
Ixx = 0.00963;       % moment of inertia around x-axis [kg*m^2]
Iyy = 0.00963;       % moment of inertia around y-axis [kg*m^2]
Izz = 0.019;         % moment of inertia around z-axis [kg*m^2]

% -----------------------------
% Motor and aerodynamic coefficients
% -----------------------------
b = 3.59e-5;         % thrust coefficient
d = 2.081e-6;        % drag torque coefficient
Jr = 0.04439;        % rotor inertia

% -----------------------------
% Linear air resistance coefficients
% -----------------------------
Ax = 0.1;
Ay = 0.1;
Az = 0.1;

kdx = 0.1;
kdy = 0.1;
kdh = 0.1;

% ============================================================
% MOTOR LIMITS AND CONTROL INPUT SATURATIONS
% ============================================================

omega_hover = sqrt((m*g)/(4*b));  % approximate hover angular velocity [rad/s]
omega_max = 500;                  % upper motor speed limit [rad/s]

U1_min = 0;
U1_max = 2.5*m*g;

U2_max = 0.5;
U3_max = 0.5;
U4_max = 0.10;

U2_min = -U2_max;

% Zero moments for the first z-axis test
U2_zero = 0;
U3_zero = 0;
U4_zero = 0;

% ============================================================
% PID PARAMETERS ACCORDING TO MUHAMMAD
% Used as initial reference values
% ============================================================

% Altitude PID controller
Kp_h = 4.3;
Ki_h = 4.5;
Kd_h = 2.0;

% Roll PID controller
Kp_phi = 0.006;
Ki_phi = 0.000009;
Kd_phi = 0.013;

% Pitch PID controller
Kp_theta = 0.006;
Ki_theta = 0.000009;
Kd_theta = 0.013;

% Yaw PID controller
Kp_psi = 0.01;
Ki_psi = 0.0002;
Kd_psi = 0.03;

% ============================================================
% GA-OPTIMIZED OUTER-LOOP FLC GAINS
% ============================================================

% X-axis outer-loop FLC
k1_x = 1.797211;
k2_x = 3.731435;
Kout_x = 0.047172;
theta_ref_max = 0.034907;

% Y-axis outer-loop FLC
k1_y = 2.916350;
k2_y = 2.307857;
Kout_y = 0.037567;
phi_ref_max = 0.016155;

% ============================================================
% FINAL GA-OPTIMIZED AXIS FLC GAINS
% ============================================================

% Z-axis FLC
k1_z   = 0.350591;
k2_z   = 4.424324;
Kout_z = 3.576077;

% Roll FLC
k1_phi   = 11.549638;
k2_phi   = 2.386904;
Kout_phi = 0.019897;

% Pitch FLC
k1_theta   = 11.549638;
k2_theta   = 2.386904;
Kout_theta = 0.019897;

% Yaw FLC
k1_psi   = 21.238180;
k2_psi   = 3.994971;
Kout_psi = 0.004575;

% ============================================================
% STATUS OUTPUT
% ============================================================

disp("UAV parameters loaded.");
disp("omega_hover = " + omega_hover + " rad/s");