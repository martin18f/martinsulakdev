clear; clc; close all;

% ============================================================
% GA OPTIMIZATION OF FLC_z WITH ACTIVE ATTITUDE CONTROLLERS
%
% Optimized variables:
%   k1_z   - altitude error gain e_z
%   k2_z   - altitude error derivative gain de_z
%   Kout_z - fuzzy controller output gain for U1
%
% Fixed:
%   phi, theta, and psi controllers are already tuned
%
% Test mode:
%   z_ref     = 1
%   phi_ref   = deg2rad(2)
%   theta_ref = deg2rad(2)
%   psi_ref   = deg2rad(5)
% ============================================================

% ------------------------------------------------------------
% Load UAV parameters and fuzzy system
% ------------------------------------------------------------
init_uav_params;
fis_uav_axis;

% ------------------------------------------------------------
% Fixed optimized attitude FLC gains
% ------------------------------------------------------------

% Roll controller gains
k1_phi   = 11.549638;
k2_phi   = 2.386904;
Kout_phi = 0.019897;

% Pitch controller gains
k1_theta   = 11.549638;
k2_theta   = 2.386904;
Kout_theta = 0.019897;

% Yaw controller gains
k1_psi   = 21.238180;
k2_psi   = 3.994971;
Kout_psi = 0.004575;

% ------------------------------------------------------------
% Simulink model configuration
% ------------------------------------------------------------
model = "uav_with_FLC_with_GA_z_axe";
stopTime = "30";

load_system(model);
set_param(model, "SimulationMode", "accelerator");

% ------------------------------------------------------------
% Parallel pool configuration
% ------------------------------------------------------------
if license("test", "Distrib_Computing_Toolbox")
    pool = gcp("nocreate");

    if isempty(pool)
        parpool;
    end

    fprintf("Parallel pool is active with %d workers.\n", gcp().NumWorkers);
else
    warning("Parallel Computing Toolbox is not available. parsim will run serially.");
end

% ------------------------------------------------------------
% Genetic algorithm settings
% ------------------------------------------------------------
popSize = 24;
maxGenerations = 25;
eliteCount = 2;
mutationRate = 0.25;

nVars = 3;

% Optimized variables:
% x(1) = k1_z
% x(2) = k2_z
% x(3) = Kout_z
%
% Original isolated z-axis result:
% k1_z   = 0.328566
% k2_z   = 0.919504
% Kout_z = 3.316561
%
% With active attitude control, the z-axis error was approximately 0.13 m.
% Therefore, higher k1_z and slightly higher Kout_z are allowed.
lb = [0.35, 1.00, 2.50];
ub = [0.80, 4.50, 4.30];

rng(4);

% ------------------------------------------------------------
% Initial population
% ------------------------------------------------------------
population = lb + rand(popSize, nVars) .* (ub - lb);

% Baseline solutions
population(1,:) = [0.343121, 1.086570, 4.172044];  % last GA solution with small overshoot
population(2,:) = [0.550000, 1.600000, 3.500000];  % Test A
population(3,:) = [0.600000, 2.000000, 3.300000];  % Test B
population(4,:) = [0.650000, 1.800000, 3.000000];  % Test C
population(5,:) = [0.450000, 2.500000, 3.200000];  % compromise solution
population(6,:) = [0.500000, 3.000000, 3.000000];  % more damping

fitness = inf(popSize, 1);
bestHistory = zeros(maxGenerations, 1);

fprintf("Starting GA optimization for FLC_z under full attitude control...\n");
fprintf("Model: %s\n", model);
fprintf("StopTime: %s s\n", stopTime);

% ============================================================
% MAIN GA LOOP
% ============================================================
for gen = 1:maxGenerations

    fprintf("\n========================================\n");
    fprintf("Generation %d/%d\n", gen, maxGenerations);
    fprintf("========================================\n");

    fitness = evaluatePopulationFLCzFullAttitude_parsim(population, model, stopTime);

    for i = 1:popSize
        fprintf("Individual %02d | k1_z=%.4f k2_z=%.4f Kout_z=%.4f | fitness=%.6f\n", ...
            i, population(i,1), population(i,2), population(i,3), fitness(i));
    end

    [fitness, idx] = sort(fitness);
    population = population(idx, :);

    best = population(1,:);
    bestFit = fitness(1);
    bestHistory(gen) = bestFit;

    fprintf("\nBest in generation %d:\n", gen);
    fprintf("k1_z   = %.6f\n", best(1));
    fprintf("k2_z   = %.6f\n", best(2));
    fprintf("Kout_z = %.6f\n", best(3));
    fprintf("fitness = %.6f\n", bestFit);

    % New population
    newPopulation = zeros(size(population));

    % Elitism
    newPopulation(1:eliteCount, :) = population(1:eliteCount, :);

    for i = eliteCount+1:popSize

        parent1 = tournamentSelect(population, fitness);
        parent2 = tournamentSelect(population, fitness);

        % Arithmetic crossover
        alpha = rand();
        child = alpha * parent1 + (1 - alpha) * parent2;

        % Mutation
        if rand() < mutationRate
            mutIndex = randi(nVars);
            sigma = 0.15 * (ub(mutIndex) - lb(mutIndex));
            child(mutIndex) = child(mutIndex) + sigma * randn();
        end

        % Limit the child to the allowed range
        child = max(child, lb);
        child = min(child, ub);

        newPopulation(i,:) = child;
    end

    population = newPopulation;
end

% ============================================================
% FINAL EVALUATION
% ============================================================
fprintf("\nFinal population evaluation...\n");

fitness = evaluatePopulationFLCzFullAttitude_parsim(population, model, stopTime);

[fitness, idx] = sort(fitness);
population = population(idx, :);

best = population(1,:);
bestFit = fitness(1);

fprintf("\n========================================\n");
fprintf("FINAL BEST SOLUTION FOR Z FULL ATTITUDE\n");
fprintf("========================================\n");
fprintf("k1_z   = %.6f\n", best(1));
fprintf("k2_z   = %.6f\n", best(2));
fprintf("Kout_z = %.6f\n", best(3));
fprintf("fitness = %.6f\n", bestFit);
fprintf("========================================\n");

% Save best gains to the base workspace
assignin("base", "k1_z", best(1));
assignin("base", "k2_z", best(2));
assignin("base", "Kout_z", best(3));

assignin("base", "k1_phi", k1_phi);
assignin("base", "k2_phi", k2_phi);
assignin("base", "Kout_phi", Kout_phi);

assignin("base", "k1_theta", k1_theta);
assignin("base", "k2_theta", k2_theta);
assignin("base", "Kout_theta", Kout_theta);

assignin("base", "k1_psi", k1_psi);
assignin("base", "k2_psi", k2_psi);
assignin("base", "Kout_psi", Kout_psi);

assignin("base", "fis_axis", fis_axis);

% ============================================================
% SIMULATION WITH THE BEST PARAMETERS
% ============================================================
simOutBest = sim(model, ...
    "StopTime", stopTime, ...
    "SimulationMode", "accelerator", ...
    "ReturnWorkspaceOutputs", "on" ...
    );

zr_ts       = getSimOutSignal(simOutBest, "zr_log");
z_ts        = getSimOutSignal(simOutBest, "z_log");
phiRef_ts   = getSimOutSignal(simOutBest, "phi_ref_log");
phi_ts      = getSimOutSignal(simOutBest, "phi_log");
thetaRef_ts = getSimOutSignal(simOutBest, "theta_ref_log");
theta_ts    = getSimOutSignal(simOutBest, "theta_log");
psiRef_ts   = getSimOutSignal(simOutBest, "psi_ref_log");
psi_ts      = getSimOutSignal(simOutBest, "psi_log");
U1_ts       = getSimOutSignal(simOutBest, "U1_log");

metrics = calculateFullAttitudeZMetrics( ...
    zr_ts, z_ts, ...
    phiRef_ts, phi_ts, ...
    thetaRef_ts, theta_ts, ...
    psiRef_ts, psi_ts, ...
    U1_ts);

fprintf("\nBEST Z FULL ATTITUDE SOLUTION METRICS\n");
fprintf("z RMSE                = %.6f\n", metrics.zRmse);
fprintf("z final error         = %.6f m\n", metrics.zFinalError);
fprintf("z overshoot           = %.6f m\n", metrics.zOvershoot);
fprintf("z late std            = %.6f\n", metrics.zLateStd);
fprintf("Final z               = %.6f m\n", metrics.finalZ);
fprintf("Max z                 = %.6f m\n", metrics.maxZ);
fprintf("Min z                 = %.6f m\n", metrics.minZ);
fprintf("phi final error       = %.6f rad\n", metrics.phiFinalError);
fprintf("theta final error     = %.6f rad\n", metrics.thetaFinalError);
fprintf("psi final error       = %.6f rad\n", metrics.psiFinalError);
fprintf("Mean |U1|             = %.6f N\n", metrics.meanAbsU1);
fprintf("Max |U1|              = %.6f N\n", metrics.maxAbsU1);

% ============================================================
% PLOTS
% ============================================================

figure;
plot(bestHistory, "LineWidth", 1.5);
grid on;
xlabel("Generation");
ylabel("Best fitness");
title("GA optimization progress for FLC_z under full attitude control");

figure;
plot(zr_ts.Time, zr_ts.Data, "LineWidth", 1.5);
hold on;
plot(z_ts.Time, z_ts.Data, "LineWidth", 1.5);
grid on;
xlabel("Time [s]");
ylabel("z [m]");
legend("z reference", "z output", "Location", "best");
title("z response after GA_z_full_attitude optimization");

figure;
plot(phiRef_ts.Time, phiRef_ts.Data, "LineWidth", 1.5);
hold on;
plot(phi_ts.Time, phi_ts.Data, "LineWidth", 1.5);
grid on;
xlabel("Time [s]");
ylabel("phi [rad]");
legend("phi reference", "phi output", "Location", "best");
title("phi response during GA_z_full_attitude result");

figure;
plot(thetaRef_ts.Time, thetaRef_ts.Data, "LineWidth", 1.5);
hold on;
plot(theta_ts.Time, theta_ts.Data, "LineWidth", 1.5);
grid on;
xlabel("Time [s]");
ylabel("theta [rad]");
legend("theta reference", "theta output", "Location", "best");
title("theta response during GA_z_full_attitude result");

figure;
plot(psiRef_ts.Time, psiRef_ts.Data, "LineWidth", 1.5);
hold on;
plot(psi_ts.Time, psi_ts.Data, "LineWidth", 1.5);
grid on;
xlabel("Time [s]");
ylabel("psi [rad]");
legend("psi reference", "psi output", "Location", "best");
title("psi response during GA_z_full_attitude result");

figure;
plot(U1_ts.Time, U1_ts.Data, "LineWidth", 1.5);
grid on;
xlabel("Time [s]");
ylabel("U1 [N]");
title("U1 after GA_z_full_attitude optimization");

assignin("base", "best_k1_z_full", best(1));
assignin("base", "best_k2_z_full", best(2));
assignin("base", "best_Kout_z_full", best(3));
assignin("base", "best_fitness_z_full", bestFit);
assignin("base", "best_metrics_z_full", metrics);

fprintf("\nSaved to workspace:\n");
fprintf("best_k1_z_full, best_k2_z_full, best_Kout_z_full, best_fitness_z_full, best_metrics_z_full\n");

% ============================================================
% LOCAL FUNCTIONS
% ============================================================

function fitness = evaluatePopulationFLCzFullAttitude_parsim(population, model, stopTime)

    popSize = size(population, 1);
    fitness = inf(popSize, 1);

    in(popSize, 1) = Simulink.SimulationInput(model);

    % Fixed attitude gains
    fixed_k1_phi = 11.549638;
    fixed_k2_phi = 2.386904;
    fixed_Kout_phi = 0.019897;

    fixed_k1_theta = 11.549638;
    fixed_k2_theta = 2.386904;
    fixed_Kout_theta = 0.019897;

    fixed_k1_psi = 21.238180;
    fixed_k2_psi = 3.994971;
    fixed_Kout_psi = 0.004575;

    for i = 1:popSize

        k1_z = population(i, 1);
        k2_z = population(i, 2);
        Kout_z = population(i, 3);

        in(i) = Simulink.SimulationInput(model);

        in(i) = in(i).setModelParameter( ...
            "StopTime", stopTime, ...
            "SimulationMode", "accelerator", ...
            "ReturnWorkspaceOutputs", "on");

        % Optimized z-axis gains
        in(i) = in(i).setVariable("k1_z", k1_z);
        in(i) = in(i).setVariable("k2_z", k2_z);
        in(i) = in(i).setVariable("Kout_z", Kout_z);

        % Fixed roll gains
        in(i) = in(i).setVariable("k1_phi", fixed_k1_phi);
        in(i) = in(i).setVariable("k2_phi", fixed_k2_phi);
        in(i) = in(i).setVariable("Kout_phi", fixed_Kout_phi);

        % Fixed pitch gains
        in(i) = in(i).setVariable("k1_theta", fixed_k1_theta);
        in(i) = in(i).setVariable("k2_theta", fixed_k2_theta);
        in(i) = in(i).setVariable("Kout_theta", fixed_Kout_theta);

        % Fixed yaw gains
        in(i) = in(i).setVariable("k1_psi", fixed_k1_psi);
        in(i) = in(i).setVariable("k2_psi", fixed_k2_psi);
        in(i) = in(i).setVariable("Kout_psi", fixed_Kout_psi);
    end

    try
        attachedFiles = {
            which("init_uav_params.m")
            which("fis_uav_axis.m")
        };

        attachedFiles = attachedFiles(~cellfun(@isempty, attachedFiles));

        simOut = parsim(in, ...
            "ShowProgress", "on", ...
            "ShowSimulationManager", "off", ...
            "SetupFcn", @setupFLCWorker, ...
            "AttachedFiles", attachedFiles, ...
            "UseFastRestart", "on", ...
            "StopOnError", "off");

    catch ME
        warning("parsim failed for the whole population: %s", ME.message);
        fitness(:) = 1e6;
        return;
    end

    for i = 1:popSize
        try
            if isprop(simOut(i), "ErrorMessage") && ~isempty(simOut(i).ErrorMessage)
                warning("Simulation %d failed: %s", i, simOut(i).ErrorMessage);
                fitness(i) = 1e6;
                continue;
            end

            zr_ts       = getSimOutSignal(simOut(i), "zr_log");
            z_ts        = getSimOutSignal(simOut(i), "z_log");
            phiRef_ts   = getSimOutSignal(simOut(i), "phi_ref_log");
            phi_ts      = getSimOutSignal(simOut(i), "phi_log");
            thetaRef_ts = getSimOutSignal(simOut(i), "theta_ref_log");
            theta_ts    = getSimOutSignal(simOut(i), "theta_log");
            psiRef_ts   = getSimOutSignal(simOut(i), "psi_ref_log");
            psi_ts      = getSimOutSignal(simOut(i), "psi_log");
            U1_ts       = getSimOutSignal(simOut(i), "U1_log");

            metrics = calculateFullAttitudeZMetrics( ...
                zr_ts, z_ts, ...
                phiRef_ts, phi_ts, ...
                thetaRef_ts, theta_ts, ...
                psiRef_ts, psi_ts, ...
                U1_ts);

            % Safety penalties
            if isnan(metrics.zRmse) || isinf(metrics.zRmse)
                fitness(i) = 1e6;
                continue;
            end

            if metrics.maxZ > 3.0 || metrics.minZ < -0.01
                fitness(i) = 1e6;
                continue;
            end

            if metrics.maxAbsPhi > 0.25 || metrics.maxAbsTheta > 0.25 || metrics.maxAbsPsi > 0.40
                fitness(i) = 1e6;
                continue;
            end

            % Strong penalty for excessive altitude overshoot
            if metrics.zOvershoot > 0.35
                fitness(i) = 1e4 + 1000 * metrics.zOvershoot + 100 * metrics.zFinalError;
                continue;
            end

            % Penalty for excessive final altitude error
            if metrics.zFinalError > 0.10
                fitness(i) = 1e3 + 100 * metrics.zFinalError + 50 * metrics.zOvershoot;
                continue;
            end

            fitness(i) = ...
                8.0  * metrics.zRmse + ...
                35.0 * metrics.zFinalError + ...
                20.0 * metrics.zOvershoot + ...
                5.0  * metrics.zLateStd + ...
                2.0  * metrics.phiFinalError + ...
                2.0  * metrics.thetaFinalError + ...
                2.0  * metrics.psiFinalError + ...
                0.02 * metrics.meanAbsU1;

        catch ME
            warning("Fitness calculation failed for individual %d: %s", i, ME.message);
            fitness(i) = 1e6;
        end
    end
end

function setupFLCWorker()
    evalin("base", "init_uav_params");
    evalin("base", "fis_uav_axis");
end

function metrics = calculateFullAttitudeZMetrics( ...
    zr_ts, z_ts, ...
    phiRef_ts, phi_ts, ...
    thetaRef_ts, theta_ts, ...
    psiRef_ts, psi_ts, ...
    U1_ts)

    % Use the z-axis time vector as the common evaluation time base
    t = z_ts.Time(:);
    z = z_ts.Data(:);

    zr       = interp1(zr_ts.Time(:),       zr_ts.Data(:),       t, "linear", "extrap");
    phi      = interp1(phi_ts.Time(:),      phi_ts.Data(:),      t, "linear", "extrap");
    phiRef   = interp1(phiRef_ts.Time(:),   phiRef_ts.Data(:),   t, "linear", "extrap");
    theta    = interp1(theta_ts.Time(:),    theta_ts.Data(:),    t, "linear", "extrap");
    thetaRef = interp1(thetaRef_ts.Time(:), thetaRef_ts.Data(:), t, "linear", "extrap");
    psi      = interp1(psi_ts.Time(:),      psi_ts.Data(:),      t, "linear", "extrap");
    psiRef   = interp1(psiRef_ts.Time(:),   psiRef_ts.Data(:),   t, "linear", "extrap");
    U1       = interp1(U1_ts.Time(:),       U1_ts.Data(:),       t, "linear", "extrap");

    % Evaluate after the z reference step
    idx = t >= 1;

    if ~any(idx)
        metrics = badMetrics();
        return;
    end

    tEval = t(idx);
    zEval = z(idx);
    zrEval = zr(idx);

    phiEval = phi(idx);
    phiRefEval = phiRef(idx);

    thetaEval = theta(idx);
    thetaRefEval = thetaRef(idx);

    psiEval = psi(idx);
    psiRefEval = psiRef(idx);

    U1Eval = U1(idx);

    eZ = zrEval - zEval;
    ePhi = phiRefEval - phiEval;
    eTheta = thetaRefEval - thetaEval;
    ePsi = psiRefEval - psiEval;

    zTarget = zrEval(end);

    metrics.zRmse = sqrt(mean(eZ.^2));
    metrics.zFinalError = abs(eZ(end));
    metrics.finalZ = zEval(end);
    metrics.maxZ = max(zEval);
    metrics.minZ = min(zEval);
    metrics.zOvershoot = max(0, max(zEval) - zTarget);

    idxLate = tEval >= 10;
    if any(idxLate)
        metrics.zLateStd = std(zEval(idxLate));
    else
        metrics.zLateStd = 0;
    end

    metrics.phiFinalError = abs(ePhi(end));
    metrics.thetaFinalError = abs(eTheta(end));
    metrics.psiFinalError = abs(ePsi(end));

    metrics.maxAbsPhi = max(abs(phiEval));
    metrics.maxAbsTheta = max(abs(thetaEval));
    metrics.maxAbsPsi = max(abs(psiEval));

    metrics.meanAbsU1 = mean(abs(U1Eval));
    metrics.maxAbsU1 = max(abs(U1Eval));
end

function metrics = badMetrics()
    metrics.zRmse = 1e6;
    metrics.zFinalError = 1e6;
    metrics.finalZ = 1e6;
    metrics.maxZ = 1e6;
    metrics.minZ = -1e6;
    metrics.zOvershoot = 1e6;
    metrics.zLateStd = 1e6;
    metrics.phiFinalError = 1e6;
    metrics.thetaFinalError = 1e6;
    metrics.psiFinalError = 1e6;
    metrics.maxAbsPhi = 1e6;
    metrics.maxAbsTheta = 1e6;
    metrics.maxAbsPsi = 1e6;
    metrics.meanAbsU1 = 1e6;
    metrics.maxAbsU1 = 1e6;
end

function ts = getSimOutSignal(simOut, signalName)
    try
        ts = simOut.(signalName);
    catch
        try
            ts = simOut.get(signalName);
        catch
            error("Signal '%s' was not found in simOut. Check the To Workspace block name.", signalName);
        end
    end

    if ~isa(ts, "timeseries")
        error("Signal '%s' is not a timeseries. Set To Workspace Save format to 'Timeseries'.", signalName);
    end
end

function parent = tournamentSelect(population, fitness)

    n = size(population, 1);
    candidates = randi(n, [3, 1]);

    [~, bestLocalIdx] = min(fitness(candidates));
    parent = population(candidates(bestLocalIdx), :);
end
