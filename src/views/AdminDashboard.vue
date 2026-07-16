<template>
  <div class="min-h-screen bg-[#0B1020] text-slate-200">
    <!-- 1. LOGIN OVERLAY (If not authenticated) -->
    <div
      v-if="!isAuthenticated"
      class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div
        class="absolute top-1/4 left-1/4 h-[350px] w-[350px] bg-cyber-primary/10 rounded-full blur-[120px] pointer-events-none"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] bg-cyber-accent/15 rounded-full blur-[120px] pointer-events-none"
      ></div>

      <div
        class="w-full max-w-md p-8 rounded-lg glass-panel border border-white/10 relative z-10 space-y-6"
      >
        <div class="text-center space-y-2">
          <h1
            class="text-2xl font-extrabold font-mono tracking-wider text-cyber-primary"
          >
            // ADMIN.<span class="text-cyber-secondary">CONSOLE</span>
          </h1>
          <p class="text-xs text-slate-400">
            SECURE MANAGEMENT ACCESS TERMINAL
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label
              class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
              >Operator Credentials</label
            >
            <input
              v-model="loginForm.usernameOrEmail"
              type="text"
              placeholder="Username or Email"
              class="w-full bg-[#0B1020] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
              required
            />
          </div>

          <div class="space-y-1">
            <label
              class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
              >Security Password</label
            >
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••••••"
              class="w-full bg-[#0B1020] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
              required
            />
          </div>

          <!-- Mathematical Captcha -->
          <div class="space-y-1">
            <label
              class="text-xs uppercase font-mono tracking-wider text-slate-400 block"
              >Matematik captcha:
              <span class="text-cyber-primary font-bold">{{
                loginCaptchaQuestion
              }}</span></label
            >
            <div class="flex gap-2">
              <input
                v-model="loginForm.captchaAnswer"
                type="text"
                placeholder="Javobingiz"
                class="flex-1 bg-[#0B1020] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary font-mono"
                required
              />
              <button
                type="button"
                @click="loadLoginCaptcha"
                class="px-3 bg-slate-800 border border-white/10 rounded text-slate-300 hover:bg-slate-700 transition text-xs font-mono"
                title="Yangilash"
              >
                🔄
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loginLoading"
            class="w-full py-2.5 rounded font-mono text-sm font-bold bg-cyber-primary text-[#0B1020] transition hover:bg-cyber-primary/90 focus:outline-none shadow-neon-primary disabled:opacity-50"
          >
            {{ loginLoading ? "AUTHENTICATING..." : "ACCESS CONTROL" }}
          </button>
        </form>
      </div>
    </div>

    <!-- 2. MAIN SIDEBAR LAYOUT (If authenticated) -->
    <div v-else class="flex min-h-screen">
      <!-- LEFT SIDEBAR -->
      <aside
        class="w-64 bg-[#131C35] border-r border-white/10 flex flex-col justify-between shrink-0"
      >
        <div class="space-y-6 p-6">
          <div class="border-b border-white/5 pb-4">
            <span
              class="text-lg font-bold tracking-wider font-mono text-cyber-primary block"
            >
              // CONTROL.<span class="text-cyber-accent">NODE</span>
            </span>
            <span
              class="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mt-1"
              >Global Scope Console</span
            >
          </div>

          <!-- Navigation Menu Links -->
          <nav class="space-y-2">
            <button
              @click="activeSection = 'dashboard'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="
                activeSection === 'dashboard'
                  ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary'
                  : 'text-slate-400'
              "
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
              </svg>
              DASHBOARD OVERVIEW
            </button>

            <button
              @click="activeSection = 'ctfs'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="
                activeSection === 'ctfs'
                  ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary'
                  : 'text-slate-400'
              "
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"></path>
              </svg>
              CTF DATABASE
            </button>

            <button
              @click="activeSection = 'hackathons'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="
                activeSection === 'hackathons'
                  ? 'bg-cyber-secondary/10 text-cyber-secondary border border-cyber-secondary/20 shadow-neon-secondary'
                  : 'text-slate-400'
              "
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              HACKATHONS ARENA
            </button>

            <button
              @click="activeSection = 'logs'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="
                activeSection === 'logs'
                  ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary'
                  : 'text-slate-400'
              "
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              SECURITY LOGS
            </button>

            <button
              @click="activeSection = 'settings'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="
                activeSection === 'settings'
                  ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary'
                  : 'text-slate-400'
              "
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              SETTINGS CONSOLE
            </button>
          </nav>
        </div>

        <!-- Sidebar footer operator capsule -->
        <div
          class="p-6 border-t border-white/5 bg-[#0B1020]/50 space-y-3 font-mono text-[10px]"
        >
          <div class="space-y-1">
            <span class="text-slate-500 block uppercase">Active Operator</span>
            <span class="font-bold text-white block">{{
              adminUser?.username
            }}</span>
            <span class="text-cyber-accent block">{{ adminUser?.email }}</span>
          </div>
          <button
            @click="handleLogout"
            class="w-full py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded hover:border-red-500/40 transition"
          >
            DISCONNECT NODE
          </button>
        </div>
      </aside>

      <!-- RIGHT CONTENT CONTAINER -->
      <main class="flex-1 min-w-0 bg-[#0B1020] p-8 overflow-y-auto space-y-8">
        <!-- Navbar Breadcrumb header -->
        <header
          class="flex justify-between items-center border-b border-white/5 pb-4 mb-4"
        >
          <div>
            <h2
              class="text-xl font-bold font-mono text-white tracking-wider uppercase"
            >
              // System.{{ activeSection }}
            </h2>
            <p
              class="text-[10px] text-slate-500 uppercase tracking-widest mt-1"
            >
              Platform management console node status: ACTIVE
            </p>
          </div>
          <div class="text-xs font-mono text-slate-400">
            Time: {{ new Date().toLocaleTimeString() }}
          </div>
        </header>

        <!-- SECTION A: DASHBOARD OVERVIEW -->
        <section
          v-if="activeSection === 'dashboard'"
          class="space-y-8 animate-fade-in"
        >
          <!-- Metrics Overview Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1"
            >
              <span class="text-[10px] text-slate-400 block uppercase font-mono"
                >Total Operators</span
              >
              <span class="text-2xl font-extrabold text-white font-mono">{{
                stats.users
              }}</span>
            </div>
            <div
              class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1"
            >
              <span class="text-[10px] text-slate-400 block uppercase font-mono"
                >Assigned Teams</span
              >
              <span
                class="text-2xl font-extrabold text-cyber-primary font-mono"
                >{{ stats.teams }}</span
              >
            </div>
            <div
              class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1"
            >
              <span class="text-[10px] text-slate-400 block uppercase font-mono"
                >Active CTFs</span
              >
              <span
                class="text-2xl font-extrabold text-cyber-secondary font-mono"
                >{{ stats.ctfs }}</span
              >
            </div>
            <div
              class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1"
            >
              <span class="text-[10px] text-slate-400 block uppercase font-mono"
                >Completed Hackathons</span
              >
              <span
                class="text-2xl font-extrabold text-cyber-accent font-mono"
                >{{ stats.hackathons }}</span
              >
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Velocity Chart -->
            <div
              class="p-6 rounded-lg glass-panel border border-white/5 space-y-2"
            >
              <h3 class="text-sm font-bold font-mono text-white">
                // USER REGISTRATION VELOCITY (LAST 14 DAYS)
              </h3>
              <div v-if="velocityChartSeries[0].data.length > 0">
                <apexchart
                  type="line"
                  height="280"
                  :options="velocityChartOptions"
                  :series="velocityChartSeries"
                ></apexchart>
              </div>
              <div
                v-else
                class="h-[280px] flex items-center justify-center text-xs text-slate-500 font-mono"
              >
                Gathering activity vectors...
              </div>
            </div>
            <!-- Category Chart -->
            <div
              class="p-6 rounded-lg glass-panel border border-white/5 space-y-2"
            >
              <h3 class="text-sm font-bold font-mono text-white">
                // CHALLENGES BY CATEGORY RANGE
              </h3>
              <div v-if="categoryChartSeries[0].data.length > 0">
                <apexchart
                  type="bar"
                  height="280"
                  :options="categoryChartOptions"
                  :series="categoryChartSeries"
                ></apexchart>
              </div>
              <div
                v-else
                class="h-[280px] flex items-center justify-center text-xs text-slate-500 font-mono"
              >
                Reading challenge metadata...
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION B: CTF DATABASE -->
        <section
          v-if="activeSection === 'ctfs'"
          class="space-y-6 animate-fade-in"
        >
          <div
            class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
          >
            <div
              class="flex justify-between items-center border-b border-white/5 pb-3"
            >
              <h3
                class="text-sm font-bold font-mono text-white uppercase tracking-wider"
              >
                // ACTIVE CHALLENGES REGISTRY
              </h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="promptResetProgress('ctf')"
                  class="flex items-center space-x-1.5 px-4 py-1.5 bg-yellow-600/30 hover:bg-yellow-600/40 text-yellow-500 border border-yellow-500/20 text-xs font-bold font-mono rounded transition"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span>RESET PRACTICE PROGRESS</span>
                </button>
                <button
                  @click="openCreateModal"
                  class="px-4 py-1.5 bg-cyber-primary text-[#0B1020] text-xs font-bold font-mono rounded hover:bg-cyber-primary/90 transition shadow-neon-primary"
                >
                  + DEPLOY NEW CHALLENGE
                </button>
              </div>
            </div>

            <!-- CTF Table List -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400">
                    <th class="py-3 px-4">Title</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Difficulty</th>
                    <th class="py-3 px-4">Stars</th>
                    <th class="py-3 px-4">Association</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4">Questions</th>
                    <th class="py-3 px-4">Author</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr
                    v-for="ctf in challenges"
                    :key="ctf._id"
                    class="hover:bg-white/5 transition"
                  >
                    <td class="py-3 px-4 font-bold text-white">
                      {{ ctf.title }}
                    </td>
                    <td class="py-3 px-4">{{ ctf.category }}</td>
                    <td class="py-3 px-4">
                      <span
                        class="px-2 py-0.5 rounded font-bold"
                        :class="getDifficultyClass(ctf.difficulty)"
                      >
                        {{ ctf.difficulty.toUpperCase() }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-cyber-primary">
                      ★ {{ ctf.stars }}
                    </td>
                    <td class="py-3 px-4">
                      <span
                        class="px-2 py-0.5 rounded font-bold text-[10px]"
                        :class="getAssociationClass(ctf._id)"
                      >
                        {{ getChallengeAssociation(ctf._id) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <select
                        :value="ctf.status"
                        @change="
                          handleStatusChange(ctf._id, $event.target.value)
                        "
                        class="bg-[#0B1020] border border-white/15 rounded text-[10px] px-1 py-0.5 focus:outline-none luxury-select"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-slate-300 font-bold">
                      {{ ctf.questions?.length || 0 }} / 10
                    </td>
                    <td class="py-3 px-4 text-slate-400">
                      {{ ctf.author?.username || "Unknown" }}
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-end space-x-1.5">
                        <button
                          @click="openEditModal(ctf)"
                          title="Tahrirlash"
                          class="p-1.5 bg-cyber-secondary/15 hover:bg-cyber-secondary/30 text-cyber-secondary border border-cyber-secondary/20 hover:border-cyber-secondary/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          @click="openChallengeAnalytics(ctf._id)"
                          title="Analitika"
                          class="p-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                        </button>
                        <button
                          @click="promptResetProgress('challenge', ctf._id)"
                          title="Urinishlarni tozalash"
                          class="p-1.5 bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"></path>
                          </svg>
                        </button>
                        <button
                          @click="handleDelete(ctf._id)"
                          title="O'chirish"
                          class="p-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="challenges.length === 0">
                    <td colspan="9" class="text-center py-6 text-slate-500">
                      No challenges detected. Deploy new units above.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SECTION C: HACKATHONS ARENA -->
        <section
          v-if="activeSection === 'hackathons'"
          class="space-y-6 animate-fade-in"
        >
          <div
            class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
          >
            <div
              class="flex justify-between items-center border-b border-white/5 pb-3"
            >
              <h3
                class="text-sm font-bold font-mono text-white uppercase tracking-wider"
              >
                // HACKATHONS ARENA REGISTRY
              </h3>
              <button
                @click="openHackathonModal"
                class="px-4 py-1.5 bg-cyber-secondary text-[#0B1020] text-xs font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary"
              >
                + DEPLOY NEW HACKATHON
              </button>
            </div>

            <!-- Hackathon Table List -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400">
                    <th class="py-3 px-4">Name</th>
                    <th class="py-3 px-4">Execution Window</th>
                    <th class="py-3 px-4">Max Teams</th>
                    <th class="py-3 px-4">Challenges</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr
                    v-for="h in hackathons"
                    :key="h._id"
                    class="hover:bg-white/5 transition"
                  >
                    <td class="py-3 px-4 font-bold text-white">{{ h.name }}</td>
                    <td class="py-3 px-4 text-slate-300">
                      {{ new Date(h.hackathonStart).toLocaleDateString() }} -
                      {{ new Date(h.hackathonEnd).toLocaleDateString() }}
                    </td>
                    <td class="py-3 px-4">{{ h.maxTeams }} Teams</td>
                    <td class="py-3 px-4 text-cyber-secondary font-bold">
                      {{ h.challenges?.length || 0 }} Units
                    </td>
                    <td class="py-3 px-4">
                      <select
                        :value="h.status"
                        @change="
                          handleHackathonStatusChange(h, $event.target.value)
                        "
                        class="bg-[#0B1020] border border-white/15 rounded text-[10px] px-1.5 py-0.5 focus:outline-none font-bold uppercase cursor-pointer luxury-select"
                        :class="getHackathonStatusClass(h.status)"
                      >
                        <option
                          value="upcoming"
                          class="bg-[#0B1020] text-cyber-secondary font-bold uppercase"
                        >
                          Upcoming (Draft)
                        </option>
                        <option
                          value="active"
                          class="bg-[#0B1020] text-cyber-primary font-bold uppercase"
                        >
                          Active (Open)
                        </option>
                        <option
                          value="finished"
                          class="bg-[#0B1020] text-slate-400 font-bold uppercase"
                        >
                          Finished (Close)
                        </option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-end space-x-1.5">
                        <button
                          @click="editHackathon(h)"
                          title="Tahrirlash"
                          class="p-1.5 bg-cyber-secondary/15 hover:bg-cyber-secondary/30 text-cyber-secondary border border-cyber-secondary/20 hover:border-cyber-secondary/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          @click="openHackathonAnalytics(h._id)"
                          title="Analitika"
                          class="p-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                        </button>
                        <button
                          @click="promptResetProgress('hackathon', h._id)"
                          title="Urinishlarni tozalash"
                          class="p-1.5 bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"></path>
                          </svg>
                        </button>
                        <button
                          @click="deleteHackathonPrompt(h)"
                          title="O'chirish"
                          class="p-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded transition inline-flex items-center justify-center"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="hackathons.length === 0">
                    <td colspan="7" class="text-center py-6 text-slate-500">
                      No active hackathon schedules stored. Create new above.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SECTION D: SECURITY LOGS -->
        <section
          v-if="activeSection === 'logs'"
          class="space-y-6 animate-fade-in"
        >
          <div
            class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
          >
            <h3
              class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase"
            >
              // PLATFORM AUDIT & SECURITY LOGS
            </h3>
            <div
              class="overflow-y-auto max-h-[500px] space-y-2 pr-2 text-xs font-mono"
            >
              <div
                v-for="log in logs"
                :key="log._id"
                class="p-3 rounded bg-[#131C35] border-l-2 flex justify-between items-center shadow"
                :class="
                  log.status === 'success'
                    ? 'border-cyber-primary'
                    : 'border-cyber-danger'
                "
              >
                <div>
                  <span class="text-slate-500"
                    >[{{ new Date(log.createdAt).toLocaleTimeString() }}]</span
                  >
                  <span class="font-bold text-white ml-2">{{
                    log.action
                  }}</span>
                  <span class="text-slate-300 ml-2"
                    >Operator: {{ log.userId?.username || "System" }}</span
                  >
                  <span class="text-slate-400 ml-2"
                    >- {{ JSON.stringify(log.details) }}</span
                  >
                </div>
                <div class="text-[10px] text-slate-500">
                  IP: {{ log.ipAddress }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION E: SETTINGS CONSOLE -->
        <section
          v-if="activeSection === 'settings'"
          class="space-y-6 animate-fade-in"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- User Role Manager -->
            <div
              class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
            >
              <h3
                class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase"
              >
                // Security & Role Assignment
              </h3>
              <p class="text-xs text-slate-400">
                Modify operations clearance levels and staff signatures in the
                centralized database node.
              </p>

              <form
                @submit.prevent="submitRoleChange"
                class="space-y-4 font-mono text-xs"
              >
                <div class="space-y-1">
                  <label class="text-[10px] text-slate-500 uppercase block"
                    >Target User ID (MongoDB Object ID)</label
                  >
                  <input
                    v-model="roleForm.targetUserId"
                    type="text"
                    class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary"
                    placeholder="e.g. 6a3ba54a2970eb50fcafc345"
                    required
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-500 uppercase block"
                      >Action directive</label
                    >
                    <select
                      v-model="roleForm.action"
                      class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary luxury-select"
                    >
                      <option value="add">Grant / Add Role</option>
                      <option value="remove">Revoke / Remove Role</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-500 uppercase block"
                      >Role authorization key</label
                    >
                    <select
                      v-model="roleForm.role"
                      class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary"
                    >
                      <option value="admin">Administrator (admin)</option>
                      <option value="staff">Staff Operator (staff)</option>
                      <option value="support">
                        Support Technician (support)
                      </option>
                      <option value="team_leader">
                        Team Leader (team_leader)
                      </option>
                      <option value="team_member">
                        Crew Member (team_member)
                      </option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="roleLoading"
                  class="w-full py-2 bg-cyber-primary text-[#0B1020] text-xs font-bold rounded hover:bg-cyber-primary/90 transition shadow-neon-primary disabled:opacity-50"
                >
                  {{
                    roleLoading
                      ? "COMMITTING SECURITY ROLES..."
                      : "COMMIT ROLE ACCESS CHANGE"
                  }}
                </button>
              </form>
            </div>

            <!-- Platform Rules Engine Simulation -->
            <div
              class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
            >
              <h3
                class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase"
              >
                // Platform Security Policy
              </h3>
              <div class="space-y-4 font-mono text-xs">
                <div
                  class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5"
                >
                  <div>
                    <span class="font-bold text-white block"
                      >Maintenance Lockout Node</span
                    >
                    <span class="text-[10px] text-slate-500"
                      >Blocks non-operator traffic globally when active.</span
                    >
                  </div>
                  <button
                    @click="toggleSimulatedSetting('maintenanceMode')"
                    class="px-3 py-1 rounded text-[10px] font-bold transition"
                    :class="
                      simulatedSettings.maintenanceMode
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    "
                  >
                    {{
                      simulatedSettings.maintenanceMode
                        ? "ACTIVE LOCK"
                        : "INACTIVE"
                    }}
                  </button>
                </div>

                <div
                  class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5"
                >
                  <div>
                    <span class="font-bold text-white block"
                      >Strict Password Validation</span
                    >
                    <span class="text-[10px] text-slate-500"
                      >Requires multi-character non-alphanumeric flags.</span
                    >
                  </div>
                  <button
                    @click="toggleSimulatedSetting('strictPasswords')"
                    class="px-3 py-1 rounded text-[10px] font-bold transition"
                    :class="
                      simulatedSettings.strictPasswords
                        ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 shadow-neon-primary'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    "
                  >
                    {{
                      simulatedSettings.strictPasswords ? "STRICT" : "STANDARD"
                    }}
                  </button>
                </div>

                <div
                  class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5"
                >
                  <div>
                    <span class="font-bold text-white block"
                      >API Request Rate Limit Threshold</span
                    >
                    <span
                      class="text-[10px] text-slate-500 font-bold text-cyber-secondary"
                      >{{ simulatedSettings.rateLimit }} req/sec</span
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="adjustRateLimit(-5)"
                      class="px-2 py-0.5 bg-white/5 border border-white/10 rounded hover:bg-white/10"
                    >
                      -
                    </button>
                    <button
                      @click="adjustRateLimit(5)"
                      class="px-2 py-0.5 bg-white/5 border border-white/10 rounded hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Database Management Section (Super Admin Only) -->
          <div
            v-if="adminUser?.username === 'superadmin'"
            class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
          >
            <h3
              class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase"
            >
              // Database Management Console
            </h3>
            <p class="text-xs text-slate-400">
              Perform administrative operations to clear the system's databases. Permanent deletion mechanism.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs mt-4">
              <!-- Users Card -->
              <div class="p-4 rounded bg-[#131C35] border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Collection Name</span>
                  <span class="text-sm font-bold text-white block mt-1">Users</span>
                  
                  <div class="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span class="text-[10px] text-slate-500 uppercase block">Total Records</span>
                    <span v-if="dbCountsLoading" class="text-slate-400 animate-pulse">Loading...</span>
                    <span v-else class="font-bold text-cyber-accent text-sm">{{ dbCounts.users }}</span>
                  </div>
                </div>
                <button
                  @click="confirmDeleteCollection('users')"
                  class="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold rounded transition flex items-center justify-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Delete All Users</span>
                </button>
              </div>

              <!-- Questions Card -->
              <div class="p-4 rounded bg-[#131C35] border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block font-bold tracking-wider">Collection Name</span>
                  <span class="text-sm font-bold text-white block mt-1">Questions</span>
                  
                  <div class="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span class="text-[10px] text-slate-500 uppercase block">Total Records</span>
                    <span v-if="dbCountsLoading" class="text-slate-400 animate-pulse">Loading...</span>
                    <span v-else class="font-bold text-cyber-accent text-sm">{{ dbCounts.questions }}</span>
                  </div>
                </div>
                <button
                  @click="confirmDeleteCollection('questions')"
                  class="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold rounded transition flex items-center justify-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Delete All Questions</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Environment Variables Visualizer -->
          <div
            class="p-6 rounded-lg glass-panel border border-white/5 space-y-4"
          >
            <h3
              class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase"
            >
              // Environment Configuration Node
            </h3>
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono"
            >
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase"
                  >NODE_ENV</span
                >
                <span class="font-bold text-cyber-secondary">development</span>
              </div>
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase"
                  >PORT CONFIG</span
                >
                <span class="font-bold text-cyber-secondary"
                  >ctf.techinfo.uz</span
                >
              </div>
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase"
                  >PLATFORM RUNTIME</span
                >
                <span class="font-bold text-cyber-secondary"
                  >Vite + Node Express</span
                >
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- 3. CHALLENGE CREATION / EDITING MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto"
    >
      <div
        class="relative w-full max-w-4xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel"
      >
        <div
          class="flex justify-between items-center border-b border-white/5 pb-3"
        >
          <h3 class="text-lg font-bold font-mono text-cyber-primary">
            {{
              isEditing
                ? "// EDIT CTF CHALLENGE UNIT"
                : "// DEPLOY NEW CTF CHALLENGE UNIT"
            }}
          </h3>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-white text-lg font-mono"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="submitChallenge" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Challenge Title</label
              >
              <input
                v-model="form.title"
                type="text"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                placeholder="e.g. SQL Injection Injection"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Category</label
              >
              <select
                v-model="form.category"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200 luxury-select"
              >
                <option value="Web">Web Exploitation</option>
                <option value="Scripting">Scripting</option>
                <option value="Networking">Networking</option>
                <option value="System">System Hardening</option>
                <option value="Network Security">Network Security</option>
                <option value="OSINT">OSINT</option>
                <option value="Privilege Escalation">Privilege Escalation</option>
                <option value="Active Directory">Active Directory</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Difficulty</label
              >
              <select
                v-model="form.difficulty"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200 luxury-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Stars (Rating)</label
              >
              <select
                v-model.number="form.stars"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200 luxury-select"
              >
                <option :value="1">1 Star</option>
                <option :value="2">2 Stars</option>
                <option :value="3">3 Stars</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Timer (Minutes)</label
              >
              <input
                v-model.number="form.timerMinutes"
                type="number"
                min="1"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Challenge Image</label
              >
              <div
                @dragover.prevent="dragOverImage = true"
                @dragleave.prevent="dragOverImage = false"
                @drop.prevent="onChallengeImageDrop"
                @click="challengeImageInput.click()"
                class="w-full h-24 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group"
                :class="
                  dragOverImage
                    ? 'border-cyber-primary bg-cyber-primary/5'
                    : 'border-white/10 bg-[#0B1020]/50 hover:border-cyber-primary/55'
                "
              >
                <input
                  type="file"
                  ref="challengeImageInput"
                  @change="onChallengeImageUpload"
                  accept="image/*"
                  class="hidden"
                />

                <div
                  v-if="form.image"
                  class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <span
                    class="text-[10px] font-mono text-cyber-primary font-bold"
                    >CLICK OR DROP TO CHANGE</span
                  >
                </div>

                <img
                  v-if="form.image"
                  :src="
                    form.image.startsWith('http')
                      ? form.image
                      : form.image.startsWith('/')
                        ? form.image
                        : '/' + form.image
                  "
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="text-center font-mono text-[10px] text-slate-500 p-2"
                >
                  <svg class="w-6 h-6 mx-auto mb-1.5 text-slate-500 group-hover:text-cyber-primary transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>DRAG & DROP IMAGE OR CLICK</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 md:col-span-2">
              <label
                class="text-[10px] uppercase font-mono text-slate-500 block"
                >Challenge Files / Attachments</label
              >
              <div class="flex items-center gap-3">
                <input
                  type="file"
                  ref="challengeAttachmentInput"
                  @change="onChallengeAttachmentUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="challengeAttachmentInput?.click()"
                  class="px-3 py-1.5 bg-[#131C35] hover:bg-[#1f2a4e] border border-white/10 rounded text-[10px] uppercase text-slate-300 font-mono transition"
                >
                  📎 Upload File
                </button>
                <span class="text-[10px] text-slate-500"
                  >Attach binary resources, code files, or archives for this
                  challenge.</span
                >
              </div>
              <div
                v-if="form.attachments && form.attachments.length > 0"
                class="mt-2 space-y-1"
              >
                <div
                  v-for="(fileUrl, fIdx) in form.attachments"
                  :key="fIdx"
                  class="flex items-center justify-between bg-[#131C35] border border-white/5 px-3 py-1.5 rounded text-xs"
                >
                  <a
                    :href="fileUrl"
                    target="_blank"
                    class="text-cyber-secondary font-mono hover:underline truncate max-w-[80%]"
                    >{{ fileUrl.split("/").pop() }}</a
                  >
                  <button
                    type="button"
                    @click="removeChallengeAttachment(fIdx)"
                    class="text-red-500 hover:text-red-400 font-mono text-[10px] uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500"
              >Short Description (Max 250 characters)</label
            >
            <input
              v-model="form.shortDescription"
              type="text"
              maxlength="250"
              class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
              placeholder="A brief security node breakdown..."
              required
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500"
              >Long Description (TipTap Editor)</label
            >
            <div
              class="border border-white/10 rounded bg-[#131C35] overflow-hidden"
            >
              <div
                class="bg-white/5 border-b border-white/10 p-2 flex space-x-2 text-xs font-mono"
              >
                <button
                  type="button"
                  @click="editor?.chain().focus().toggleBold().run()"
                  class="px-2 py-0.5 rounded hover:bg-white/10"
                  :class="{ 'bg-white/15': editor?.isActive('bold') }"
                >
                  B
                </button>
                <button
                  type="button"
                  @click="editor?.chain().focus().toggleItalic().run()"
                  class="px-2 py-0.5 rounded hover:bg-white/10"
                  :class="{ 'bg-white/15': editor?.isActive('italic') }"
                >
                  I
                </button>
                <button
                  type="button"
                  @click="editor?.chain().focus().toggleCode().run()"
                  class="px-2 py-0.5 rounded hover:bg-white/10"
                  :class="{ 'bg-white/15': editor?.isActive('code') }"
                >
                  Code
                </button>
              </div>
              <editor-content
                :editor="editor"
                class="p-3 text-xs min-h-[100px] text-slate-300 focus:outline-none"
              />
            </div>
          </div>



          <!-- Challenge Flags Section -->
          <div class="border-t border-white/10 pt-4 space-y-4">
            <div class="flex justify-between items-center">
              <h4
                class="text-xs uppercase font-mono font-bold tracking-widest text-cyber-secondary"
              >
                // Challenge Flags ({{ form.flags.length }} / 3)
              </h4>
              <button
                type="button"
                @click="addFlagNode"
                class="px-2 py-1 bg-cyber-secondary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary"
              >
                + ADD FLAG
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(flag, fIndex) in form.flags"
                :key="fIndex"
                class="p-3 rounded border border-white/5 bg-[#131C35]/30 space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span
                    class="text-[10px] font-mono text-cyber-accent font-bold"
                    >Flag #{{ fIndex + 1 }}</span
                  >
                  <button
                    v-if="form.flags.length > 1"
                    type="button"
                    @click="removeFlagNode(fIndex)"
                    class="text-red-500 hover:text-red-400 font-mono text-[9px] uppercase"
                  >
                    Remove
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div class="md:col-span-2 space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Flag Pattern</label
                    >
                    <input
                      v-model="form.flags[fIndex].flag"
                      type="text"
                      class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      placeholder="FLAG{cyber_sec_flag_value}"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Points</label
                    >
                    <input
                      v-model.number="form.flags[fIndex].points"
                      type="number"
                      class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Flag Hint (Optional)</label
                    >
                    <input
                      v-model="form.flags[fIndex].hint"
                      type="text"
                      class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      placeholder="Hint key or instructions"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Questions Management -->
          <div class="border-t border-white/10 pt-4 space-y-4">
            <div class="flex justify-between items-center">
              <h4
                class="text-xs uppercase font-mono font-bold tracking-widest text-cyber-secondary"
              >
                // Question Nodes ({{ form.questions.length }})
              </h4>
              <button
                type="button"
                @click="addQuestionNode"
                class="px-2 py-1 bg-cyber-secondary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary"
              >
                + ADD QUESTION
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(q, qIndex) in form.questions"
                :key="qIndex"
                class="p-4 rounded border border-white/5 bg-[#131C35]/50 space-y-3 relative"
              >
                <button
                  type="button"
                  @click="removeQuestionNode(qIndex)"
                  class="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-mono text-[10px] uppercase border border-white/10 px-2 py-0.5 rounded bg-white/5"
                >
                  Remove
                </button>

                <span class="text-[10px] font-mono text-cyber-accent block"
                  >QUESTION #{{ qIndex + 1 }}</span
                >

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Question Title</label
                    >
                    <input
                      v-model="q.title"
                      type="text"
                      class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      placeholder="e.g. Find Admin Cookie"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Points</label
                    >
                    <input
                      v-model.number="q.points"
                      type="number"
                      min="0"
                      class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[9px] uppercase font-mono text-slate-500"
                    >Question Description</label
                  >
                  <input
                    v-model="q.description"
                    type="text"
                    class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                    placeholder="Instructions for users..."
                    required
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Type</label
                    >
                    <select
                      v-model="q.type"
                      class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200 luxury-select"
                    >
                      <option value="text">Text / Input</option>
                      <option value="multiple-choice">Multiple Choice</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500"
                      >Hint (Optional)</label
                    >
                    <input
                      v-model="q.hint"
                      type="text"
                      class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                      placeholder="Hint detail..."
                    />
                  </div>
                </div>

                <div v-if="q.type === 'multiple-choice'" class="space-y-2 border border-white/5 p-2 rounded bg-black/20">
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] uppercase font-mono text-slate-400">Options</span>
                    <button
                      type="button"
                      @click="q.options.push('')"
                      class="px-1.5 py-0.5 bg-cyber-primary text-[#0B1020] text-[8px] font-bold font-mono rounded hover:bg-cyber-primary/90 transition"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div class="space-y-1.5">
                    <div
                      v-for="(opt, optIdx) in q.options"
                      :key="optIdx"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="q.options[optIdx]"
                        type="text"
                        class="flex-1 bg-[#0B1020] border border-white/10 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                        placeholder="Option text..."
                        required
                      />
                      <button
                        type="button"
                        @click="q.options.splice(optIdx, 1)"
                        class="text-red-500 hover:text-red-400 font-mono text-[9px]"
                      >
                        [x]
                      </button>
                    </div>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[9px] uppercase font-mono text-slate-500"
                    >Correct Answer</label
                  >
                  <input
                    v-model="q.correctAnswer"
                    type="text"
                    class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                    placeholder="Plaintext answer to verify..."
                    required
                  />
                </div>

                <!-- Attachment file upload hook removed -->
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10"
            >
              CANCEL
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-cyber-primary text-[#0B1020] font-mono text-xs font-bold rounded hover:bg-cyber-primary/90"
            >
              {{ isEditing ? "UPDATE CHALLENGE" : "DEPLOY CHALLENGE" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. HACKATHON CREATION MODAL -->
    <div
      v-if="showHackathonModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto"
    >
      <div
        class="relative w-full max-w-2xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel"
      >
        <div
          class="flex justify-between items-center border-b border-white/5 pb-3"
        >
          <h3 class="text-lg font-bold font-mono text-cyber-secondary">
            {{
              editingHackathonId
                ? "// EDIT HACKATHON ARENA"
                : "// DEPLOY NEW HACKATHON ARENA"
            }}
          </h3>
          <button
            @click="closeHackathonModal"
            class="text-slate-400 hover:text-white text-lg font-mono"
          >
            ×
          </button>
        </div>

        <form
          @submit.prevent="submitHackathon"
          class="space-y-4 text-xs font-mono"
        >
          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500"
              >Hackathon Name</label
            >
            <input
              v-model="hackathonForm.name"
              type="text"
              class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
              placeholder="e.g. Cyber Security Summit 2026"
              required
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500"
              >Arena Description</label
            >
            <textarea
              v-model="hackathonForm.description"
              rows="3"
              class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
              placeholder="Description of rules, timing, rewards..."
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Hackathon Run Start Date</label
              >
              <input
                v-model="hackathonForm.hackathonStart"
                type="datetime-local"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Hackathon Run End Date</label
              >
              <input
                v-model="hackathonForm.hackathonEnd"
                type="datetime-local"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Maximum Teams Allowed</label
              >
              <input
                v-model.number="hackathonForm.maxTeams"
                type="number"
                min="2"
                max="1000"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Cover Banner/Image</label
              >
              <div class="flex items-center gap-3">
                <input
                  type="file"
                  @change="onHackathonCoverUpload"
                  accept="image/*"
                  class="hidden"
                  ref="hackathonCoverInput"
                />
                <button
                  type="button"
                  @click="hackathonCoverInput?.click()"
                  class="px-3 py-1.5 bg-[#131C35] border border-white/10 rounded text-[10px] uppercase text-slate-300 font-mono"
                >
                  Upload Cover Image File
                </button>
                <span
                  class="text-[10px] text-slate-500 truncate max-w-[200px]"
                  v-if="hackathonForm.coverImage"
                >
                  {{ hackathonForm.coverImage.split("/").pop() }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="editingHackathonId" class="grid grid-cols-1 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500"
                >Hackathon Status</label
              >
              <select
                v-model="hackathonForm.status"
                class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200 luxury-select"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>

          <!-- Select Challenges Checklist -->
          <div class="space-y-2">
            <label class="text-[10px] uppercase font-mono text-slate-500 block"
              >Select challenges to bind to this Hackathon</label
            >
            <div
              class="max-h-[150px] overflow-y-auto border border-white/10 rounded p-3 bg-[#131C35]/50 space-y-2"
            >
              <div
                v-for="c in selectableChallenges"
                :key="c._id"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :id="c._id"
                  :value="c._id"
                  v-model="hackathonForm.challenges"
                  class="rounded bg-[#0B1020] border-white/10 text-cyber-secondary focus:ring-cyber-secondary"
                />
                <label
                  :for="c._id"
                  class="text-xs text-slate-300 cursor-pointer"
                >
                  {{ c.title }} ({{ c.category }} - {{ c.difficulty }})
                </label>
              </div>
              <div
                v-if="selectableChallenges.length === 0"
                class="text-center py-2 text-slate-500 text-[10px]"
              >
                No challenges available to bind.
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <button
              type="button"
              @click="closeHackathonModal"
              class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10"
            >
              CANCEL
            </button>
            <button
              type="submit"
              :disabled="hackathonLoading"
              class="px-6 py-2 bg-cyber-secondary text-[#0B1020] font-mono text-xs font-bold rounded hover:bg-cyber-secondary/90 disabled:opacity-50"
            >
              {{
                hackathonLoading
                  ? editingHackathonId
                    ? "UPDATING ARENA..."
                    : "DEPLOYING ARENA..."
                  : editingHackathonId
                    ? "UPDATE HACKATHON"
                    : "DEPLOY HACKATHON"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 5. HACKATHON ANALYTICS MONITOR MODAL -->
    <div
      v-if="showStatsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto"
    >
      <div
        class="relative w-full max-w-4xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel"
      >
        <div
          class="flex justify-between items-center border-b border-white/5 pb-3"
        >
          <div>
            <h3
              class="text-lg font-bold font-mono text-cyber-primary uppercase"
            >
              // HACKATHON ANALYTICS MONITOR
            </h3>
            <p
              class="text-[10px] font-mono text-slate-400 mt-1 uppercase"
              v-if="selectedHackathonStats?.hackathon"
            >
              Arena: {{ selectedHackathonStats.hackathon.name }} | Status:
              {{ selectedHackathonStats.hackathon.status }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshHackathonStats"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono rounded text-slate-300 transition uppercase"
            >
              🔄 Refresh
            </button>
            <button
              @click="showStatsModal = false"
              class="text-slate-400 hover:text-white text-lg font-mono"
            >
              ×
            </button>
          </div>
        </div>

        <div v-if="selectedHackathonStats" class="space-y-6 font-mono text-xs">
          <!-- Tabs Navigation -->
          <div class="flex gap-4 border-b border-white/10 pb-1">
            <button
              @click="activeStatsTab = 'live'"
              :class="[
                'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition duration-200 inline-flex items-center gap-1.5',
                activeStatsTab === 'live'
                  ? 'text-cyber-primary border-cyber-primary'
                  : 'text-slate-400 border-transparent hover:text-white'
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Standings & Activity
            </button>
            <button
              @click="activeStatsTab = 'questions'"
              :class="[
                'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition duration-200 inline-flex items-center gap-1.5',
                activeStatsTab === 'questions'
                  ? 'text-cyber-primary border-cyber-primary'
                  : 'text-slate-400 border-transparent hover:text-white'
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Question Analytics
            </button>
          </div>

          <!-- Tab 1: Standings & Activity -->
          <div v-if="activeStatsTab === 'live'" class="space-y-6">
            <!-- 1. Leaderboard Standings -->
            <div class="space-y-2">
              <h4
                class="text-xs uppercase font-bold text-cyber-secondary tracking-widest"
              >
                // Teams Standings
              </h4>
              <div
                class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30"
              >
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr
                      class="border-b border-white/10 text-slate-400 bg-white/5"
                    >
                      <th class="py-2.5 px-4">Rank</th>
                      <th class="py-2.5 px-4">Team Name</th>
                      <th class="py-2.5 px-4">Solves</th>
                      <th class="py-2.5 px-4">Score</th>
                      <th class="py-2.5 px-4">Completion %</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr
                      v-for="team in selectedHackathonStats.leaderboard"
                      :key="team._id"
                      class="hover:bg-white/5 transition"
                    >
                      <td class="py-2.5 px-4 font-bold text-white">
                        #{{ team.rank }}
                      </td>
                      <td class="py-2.5 px-4 text-cyber-secondary font-bold">
                        {{ team.teamName }}
                      </td>
                      <td class="py-2.5 px-4 text-slate-300">
                        {{ team.solved }} Solves
                      </td>
                      <td class="py-2.5 px-4 text-cyber-primary font-bold">
                        {{ team.points }} Points
                      </td>
                      <td class="py-2.5 px-4">
                        <div class="flex items-center gap-2">
                          <div
                            class="w-16 bg-white/10 h-2 rounded overflow-hidden"
                          >
                            <div
                              class="bg-cyber-primary h-full"
                              :style="{
                                width:
                                  Math.min(100, team.completionPercentage) + '%',
                              }"
                            ></div>
                          </div>
                          <span
                            >{{ Math.round(team.completionPercentage) }}%</span
                          >
                        </div>
                      </td>
                    </tr>
                    <tr v-if="selectedHackathonStats.leaderboard.length === 0">
                      <td colspan="5" class="text-center py-4 text-slate-500">
                        No score points recorded yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 2. Active Workspaces -->
            <div class="space-y-2">
              <h4
                class="text-xs uppercase font-bold text-cyber-secondary tracking-widest"
              >
                // Active Workspaces (Current Timers)
              </h4>
              <div
                class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30"
              >
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr
                      class="border-b border-white/10 text-slate-400 bg-white/5"
                    >
                      <th class="py-2.5 px-4">Team Name</th>
                      <th class="py-2.5 px-4">Active Challenge</th>
                      <th class="py-2.5 px-4">Timer Started</th>
                      <th class="py-2.5 px-4">Time Remaining</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr
                      v-for="(
                        session, sIndex
                      ) in selectedHackathonStats.activeSessions"
                      :key="sIndex"
                      class="hover:bg-white/5 transition"
                    >
                      <td class="py-2.5 px-4 font-bold text-white">
                        {{ session.teamName }}
                      </td>
                      <td class="py-2.5 px-4 text-cyber-secondary font-bold">
                        {{ session.challengeTitle }}
                      </td>
                      <td class="py-2.5 px-4 text-slate-400">
                        {{ new Date(session.openedAt).toLocaleTimeString() }}
                      </td>
                      <td class="py-2.5 px-4 text-cyber-danger font-bold">
                        {{ formatTimeRemaining(session.timeRemainingSeconds) }}
                      </td>
                    </tr>
                    <tr v-if="selectedHackathonStats.activeSessions.length === 0">
                      <td colspan="4" class="text-center py-4 text-slate-500">
                        No active sessions or timers right now.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 3. Solve Activity Feed -->
            <div class="space-y-2">
              <h4
                class="text-xs uppercase font-bold text-cyber-secondary tracking-widest"
              >
                // Real-Time Solves Feed
              </h4>
              <div
                class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30"
              >
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr
                      class="border-b border-white/10 text-slate-400 bg-white/5"
                    >
                      <th class="py-2.5 px-4">Player</th>
                      <th class="py-2.5 px-4">Team</th>
                      <th class="py-2.5 px-4">Challenge</th>
                      <th class="py-2.5 px-4">Question Node</th>
                      <th class="py-2.5 px-4">Score Awarded</th>
                      <th class="py-2.5 px-4">Time Solved</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr
                      v-for="solve in selectedHackathonStats.userSolves"
                      :key="solve._id"
                      class="hover:bg-white/5 transition border-l-2 border-cyber-primary"
                    >
                      <td class="py-2.5 px-4 font-bold text-white">
                        {{ solve.username }}
                      </td>
                      <td class="py-2.5 px-4 text-slate-300">
                        {{ solve.teamName }}
                      </td>
                      <td class="py-2.5 px-4 text-cyber-secondary font-bold">
                        {{ solve.challengeTitle }}
                      </td>
                      <td class="py-2.5 px-4 text-slate-400">
                        {{ solve.questionTitle }}
                      </td>
                      <td class="py-2.5 px-4 text-cyber-primary font-bold">
                        +{{ solve.points }} Pts
                      </td>
                      <td class="py-2.5 px-4 text-slate-500">
                        {{ new Date(solve.timestamp).toLocaleString() }}
                      </td>
                    </tr>
                    <tr v-if="selectedHackathonStats.userSolves.length === 0">
                      <td colspan="6" class="text-center py-4 text-slate-500">
                        No solves submitted yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab 2: Question Analytics -->
          <div v-else-if="activeStatsTab === 'questions'" class="space-y-6">
            <!-- Dashboard Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">// Total Questions</span>
                <span class="block text-xl font-extrabold text-cyber-primary font-mono">{{ selectedHackathonStats.dashboard?.totalQuestions || 0 }}</span>
              </div>
              <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">// Total Participants</span>
                <span class="block text-xl font-extrabold text-cyber-secondary font-mono">{{ selectedHackathonStats.dashboard?.totalParticipants || 0 }}</span>
              </div>
              <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">// Overall Success Rate</span>
                <span class="block text-xl font-extrabold text-cyber-accent font-mono">{{ selectedHackathonStats.dashboard?.overallSuccessRate || 0 }}%</span>
              </div>
              <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">// Correct / Wrong Answers</span>
                <span class="block text-sm font-bold text-slate-200 font-mono mt-1">
                  <span class="text-emerald-400">✅ {{ selectedHackathonStats.dashboard?.totalCorrectAnswers || 0 }}</span>
                  <span class="text-slate-500 mx-1.5">/</span>
                  <span class="text-rose-400">❌ {{ selectedHackathonStats.dashboard?.totalWrongAnswers || 0 }}</span>
                </span>
              </div>
            </div>

            <!-- Easiest & Most Difficult -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-[#131C35]/20 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.772-.57-.372-1.81.587-1.81H7.89a1 1 0 00.95-.69l1.52-4.674z"></path>
                  </svg>
                  Easiest Question (Eng ko'p yechilgan)
                </span>
                <span class="block text-xs font-bold text-slate-200 font-mono mt-1">{{ selectedHackathonStats.dashboard?.easiestQuestion || '—' }}</span>
              </div>
              <div class="p-4 bg-[#131C35]/20 border border-white/5 rounded-lg space-y-1">
                <span class="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  Most Difficult Question (Eng kam yechilgan)
                </span>
                <span class="block text-xs font-bold text-slate-200 font-mono mt-1">{{ selectedHackathonStats.dashboard?.mostDifficultQuestion || '—' }}</span>
              </div>
            </div>

            <!-- Question Accordion Breakdowns -->
            <div class="space-y-3">
              <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Question Breakdowns</h4>
              
              <div v-if="!selectedHackathonStats.questionStats || selectedHackathonStats.questionStats.length === 0" class="text-center py-8 border border-white/5 rounded bg-[#131C35]/30 text-slate-500">
                No questions found in this hackathon.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="q in selectedHackathonStats.questionStats"
                  :key="q.questionId"
                  class="border border-white/10 rounded-lg overflow-hidden bg-[#131C35]/20 hover:border-white/20 transition"
                >
                  <!-- Header -->
                  <div
                    @click="toggleQuestion(q.questionId)"
                    class="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition gap-4"
                  >
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 bg-white/5 rounded border border-white/10">{{ q.challengeTitle }}</span>
                        <span class="text-cyber-primary font-bold text-xs">{{ q.questionTitle }}</span>
                      </div>
                      <div class="text-[10px] text-slate-500 font-mono">
                        ID: <span class="text-slate-400">{{ q.questionId }}</span> | Max Score: <span class="text-cyber-secondary font-bold">{{ q.maxPoints }} Pts</span>
                      </div>
                    </div>

                    <!-- Stats brief -->
                    <div class="flex items-center gap-4 text-slate-300 font-mono text-[11px] select-none">
                      <div>
                        <span class="text-slate-500 uppercase text-[9px] block">Attempts</span>
                        <span class="font-bold text-white">{{ q.answeredCount }} users</span>
                      </div>
                      <div>
                        <span class="text-emerald-400 uppercase text-[9px] block">Correct</span>
                        <span class="font-bold text-emerald-400 inline-flex items-center gap-1">
                          <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {{ q.correctCount }}
                        </span>
                      </div>
                      <div>
                        <span class="text-rose-400 uppercase text-[9px] block">Wrong</span>
                        <span class="font-bold text-rose-400 inline-flex items-center gap-1">
                          <svg class="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          {{ q.wrongCount }}
                        </span>
                      </div>
                      <div>
                        <span class="text-cyber-accent uppercase text-[9px] block">Rate</span>
                        <span class="font-bold text-cyber-accent">{{ q.successRate }}%</span>
                      </div>
                      <div class="text-slate-400 text-sm ml-2">
                        {{ expandedQuestions[q.questionId] ? '▲' : '▼' }}
                      </div>
                    </div>
                  </div>

                  <!-- Collapsible Content -->
                  <div
                    v-if="expandedQuestions[q.questionId]"
                    class="border-t border-white/5 bg-[#0B1020]/50 p-4 space-y-4"
                  >
                    <!-- Detailed Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-mono border-b border-white/5 pb-4">
                      <div class="space-y-1">
                        <span class="text-slate-500 uppercase text-[9px]">Average Solve Duration</span>
                        <span class="block text-slate-200 font-bold flex items-center gap-1">
                          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ q.averageTime || '—' }}
                        </span>
                      </div>
                      <div class="space-y-1">
                        <span class="text-slate-500 uppercase text-[9px]">First Solver</span>
                        <span class="block text-emerald-400 font-bold flex items-center gap-1">
                          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                          </svg>
                          {{ q.firstSolver || '—' }}
                        </span>
                      </div>
                      <div class="space-y-1">
                        <span class="text-slate-500 uppercase text-[9px]">Last Solver</span>
                        <span class="block text-slate-300 font-bold flex items-center gap-1">
                          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                          </svg>
                          {{ q.lastSolver || '—' }}
                        </span>
                      </div>
                    </div>

                    <!-- User Submissions Table -->
                    <div class="space-y-2">
                      <span class="text-slate-400 uppercase text-[10px] font-bold tracking-wider block">// User Performance Standings</span>
                      <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/10">
                        <table class="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                              <th class="py-2 px-3">User</th>
                              <th class="py-2 px-3">Full Name</th>
                              <th class="py-2 px-3 text-center">Attempt</th>
                              <th class="py-2 px-3">Status</th>
                              <th class="py-2 px-3 text-right">Score</th>
                              <th class="py-2 px-3">Submitted At</th>
                              <th class="py-2 px-3">Time Spent</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-white/5">
                            <tr
                              v-for="u in q.userStats"
                              :key="u.username"
                              class="hover:bg-white/5 transition"
                            >
                              <td class="py-2 px-3 font-bold text-white">@{{ u.username }}</td>
                              <td class="py-2 px-3 text-slate-300">{{ u.fullName }}</td>
                              <td class="py-2 px-3 text-center text-slate-300 font-bold">{{ u.attempt }}</td>
                              <td class="py-2 px-3">
                                <span
                                  v-if="u.status === 'Correct'"
                                  class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px] uppercase"
                                >
                                  ✅ Correct
                                </span>
                                <span
                                  v-else-if="u.status === 'Wrong'"
                                  class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[9px] uppercase"
                                >
                                  ❌ Wrong
                                </span>
                                <span
                                  v-else
                                  class="px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-white/10 font-bold text-[9px] uppercase"
                                >
                                  ⏳ Not Answered
                                </span>
                              </td>
                              <td class="py-2 px-3 text-right font-bold" :class="u.status === 'Correct' ? 'text-cyber-primary' : 'text-slate-500'">
                                {{ u.score }} Pts
                              </td>
                              <td class="py-2 px-3 text-slate-400">
                                {{ u.submittedAt ? new Date(u.submittedAt).toLocaleString() : '—' }}
                              </td>
                              <td class="py-2 px-3 font-bold text-slate-300">
                                {{ u.timeSpent }}
                              </td>
                            </tr>
                            <tr v-if="!q.userStats || q.userStats.length === 0">
                              <td colspan="7" class="text-center py-3 text-slate-500">
                                No participants registered for this hackathon.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="py-12 flex justify-center items-center text-slate-400 font-mono text-xs"
        >
          🔄 Connecting to server and downloading logs...
        </div>

        <div class="flex justify-end border-t border-white/10 pt-4">
          <button
            @click="showStatsModal = false"
            class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10"
          >
            CLOSE MONITOR
          </button>
        </div>
      </div>
    </div>

    <!-- CHALLENGE ANALYTICS MODAL -->
    <div
      v-if="showChallengeAnalyticsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto animate-fade-in"
    >
      <div
        class="relative w-full max-w-4xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel"
      >
        <div
          class="flex justify-between items-center border-b border-white/5 pb-3"
        >
          <div>
            <h3
              class="text-lg font-bold font-mono text-cyber-primary uppercase"
            >
              // CHALLENGE ANALYTICS MONITOR
            </h3>
            <p
              class="text-[10px] font-mono text-slate-400 mt-1 uppercase"
              v-if="selectedChallengeAnalytics?.challenge"
            >
              Challenge: {{ selectedChallengeAnalytics.challenge.title }} | Category:
              {{ selectedChallengeAnalytics.challenge.category }} | Difficulty:
              <span class="font-bold text-cyber-secondary">{{ selectedChallengeAnalytics.challenge.difficulty.toUpperCase() }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshChallengeAnalytics"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono rounded text-slate-300 transition uppercase"
            >
              🔄 Refresh
            </button>
            <button
              @click="showChallengeAnalyticsModal = false"
              class="text-slate-400 hover:text-white text-lg font-mono"
            >
              ×
            </button>
          </div>
        </div>

        <div v-if="selectedChallengeAnalytics" class="space-y-6 font-mono text-xs">
          <!-- Overview Metrics Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">// Total Questions</span>
              <span class="block text-xl font-extrabold text-cyber-primary font-mono">{{ selectedChallengeAnalytics.questions?.length || 0 }}</span>
            </div>
            <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">// Individual Solves</span>
              <span class="block text-xl font-extrabold text-cyber-secondary font-mono">{{ selectedChallengeAnalytics.userStats?.length || 0 }} Users</span>
            </div>
            <div class="p-4 bg-[#131C35]/30 border border-white/5 rounded-lg space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">// Team Solves</span>
              <span class="block text-xl font-extrabold text-cyber-accent font-mono">{{ selectedChallengeAnalytics.teamStats?.length || 0 }} Teams</span>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="flex gap-4 border-b border-white/10 pb-1">
            <button
              @click="activeChallengeTab = 'questions'"
              :class="[
                'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition duration-200',
                activeChallengeTab === 'questions'
                  ? 'text-cyber-primary border-cyber-primary'
                  : 'text-slate-400 border-transparent hover:text-white'
              ]"
            >
              📝 Question Stats
            </button>
            <button
              @click="activeChallengeTab = 'participants'"
              :class="[
                'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition duration-200',
                activeChallengeTab === 'participants'
                  ? 'text-cyber-primary border-cyber-primary'
                  : 'text-slate-400 border-transparent hover:text-white'
              ]"
            >
              👥 Participant Logs
            </button>
          </div>

          <!-- Tab 1: Question Breakdown Accordion -->
          <div v-if="activeChallengeTab === 'questions'" class="space-y-3">
            <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Question Breakdowns</h4>
            
            <div class="text-center py-8 border border-white/5 rounded bg-[#131C35]/30 text-slate-500" v-if="!selectedChallengeAnalytics.questions || selectedChallengeAnalytics.questions.length === 0">
              No questions found in this challenge.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="q in selectedChallengeAnalytics.questions"
                :key="q._id"
                class="border border-white/10 rounded-lg overflow-hidden bg-[#131C35]/20 hover:border-white/20 transition"
              >
                <!-- Accordion Header -->
                <div
                  @click="toggleChallengeQuestion(q._id)"
                  class="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition gap-4"
                >
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-cyber-primary font-bold text-xs">{{ q.title }}</span>
                      <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">{{ q.points }} Pts</span>
                    </div>
                    <div class="text-[10px] text-slate-500 font-mono">
                      Answer: <span class="text-emerald-400 font-bold font-mono">{{ q.correctAnswer || '—' }}</span>
                    </div>
                  </div>

                  <!-- Brief stats -->
                  <div class="flex items-center gap-4 text-slate-300 font-mono text-[11px] select-none">
                    <div>
                      <span class="text-slate-500 uppercase text-[9px] block">Solved</span>
                      <span class="font-bold text-emerald-400">✅ {{ q.stats?.totalSolvedCount || 0 }}</span>
                    </div>
                    <div>
                      <span class="text-rose-400 uppercase text-[9px] block">Failed Attempts</span>
                      <span class="font-bold text-rose-400">❌ {{ q.stats?.totalFailedAttemptsSum || 0 }}</span>
                    </div>
                    <div>
                      <span class="text-cyber-accent uppercase text-[9px] block">Total Attempts</span>
                      <span class="font-bold text-cyber-accent">{{ (q.stats?.totalFailedAttemptsSum || 0) + (q.stats?.totalSolvedCount || 0) }}</span>
                    </div>
                    <div class="text-slate-400 text-sm ml-2">
                      {{ expandedChallengeQuestions[q._id] ? '▲' : '▼' }}
                    </div>
                  </div>
                </div>

                <!-- Collapsible Content -->
                <div
                  v-if="expandedChallengeQuestions[q._id]"
                  class="border-t border-white/5 bg-[#0B1020]/50 p-4 space-y-4"
                >
                  <div class="space-y-2">
                    <span class="text-slate-400 uppercase text-[10px] font-bold tracking-wider block">// User / Team Solves Breakdown</span>
                    <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/10">
                      <table class="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                            <th class="py-2 px-3">Participant</th>
                            <th class="py-2 px-3">Type</th>
                            <th class="py-2 px-3 text-center">Failed Attempts</th>
                            <th class="py-2 px-3">Status</th>
                            <th class="py-2 px-3 text-right">Solved At</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                          <!-- Individual users details -->
                          <tr
                            v-for="u in getQuestionParticipantStats(q._id)"
                            :key="u.id"
                            class="hover:bg-white/5 transition"
                          >
                            <td class="py-2 px-3 font-bold text-white">
                              {{ u.name }}
                              <span class="text-slate-500 font-normal text-[9px]" v-if="u.subtext">({{ u.subtext }})</span>
                            </td>
                            <td class="py-2 px-3 text-slate-400 uppercase text-[9px] font-bold">{{ u.type }}</td>
                            <td class="py-2 px-3 text-center text-slate-300 font-bold">{{ u.failedAttempts }}</td>
                            <td class="py-2 px-3">
                              <span
                                v-if="u.solved"
                                class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px] uppercase"
                              >
                                SOLVED
                              </span>
                              <span
                                v-else
                                class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[9px] uppercase"
                              >
                                ATTEMPTING
                              </span>
                            </td>
                            <td class="py-2 px-3 text-right text-slate-400">
                              {{ u.solvedAt ? new Date(u.solvedAt).toLocaleString() : '—' }}
                            </td>
                          </tr>
                          <tr v-if="getQuestionParticipantStats(q._id).length === 0">
                            <td colspan="5" class="text-center py-3 text-slate-500">
                              No participants have attempted this question yet.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Participants Logs -->
          <div v-else-if="activeChallengeTab === 'participants'" class="space-y-6">
            <!-- Individual Users -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Individual Players</h4>
              <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                      <th class="py-2.5 px-4">Player</th>
                      <th class="py-2.5 px-4">Full Name</th>
                      <th class="py-2.5 px-4">Session Status</th>
                      <th class="py-2.5 px-4">Solved Questions</th>
                      <th class="py-2.5 px-4">Failed Attempts</th>
                      <th class="py-2.5 px-4">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr
                      v-for="user in selectedChallengeAnalytics.userStats"
                      :key="user.userId"
                      class="hover:bg-white/5 transition"
                    >
                      <td class="py-2.5 px-4 font-bold text-white">@{{ user.username }}</td>
                      <td class="py-2.5 px-4 text-slate-300">{{ user.fullName }}</td>
                      <td class="py-2.5 px-4">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          :class="{
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': user.status === 'completed',
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': user.status === 'active',
                            'bg-red-500/10 text-red-500 border border-red-500/20': user.status === 'expired'
                          }"
                        >
                          {{ user.status }}
                        </span>
                      </td>
                      <td class="py-2.5 px-4 font-bold text-cyber-primary">
                        {{ user.questionsDetail.filter(q => q.solved).length }} / {{ user.questionsDetail.length }}
                      </td>
                      <td class="py-2.5 px-4 text-rose-400 font-bold">{{ user.failedAttempts }}</td>
                      <td class="py-2.5 px-4 text-slate-500">{{ new Date(user.openedAt).toLocaleString() }}</td>
                    </tr>
                    <tr v-if="!selectedChallengeAnalytics.userStats || selectedChallengeAnalytics.userStats.length === 0">
                      <td colspan="6" class="text-center py-4 text-slate-500">
                        No individual player sessions found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Teams -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Teams (Hackathons Arena)</h4>
              <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                      <th class="py-2.5 px-4">Team Name</th>
                      <th class="py-2.5 px-4">Session Status</th>
                      <th class="py-2.5 px-4">Solved Questions</th>
                      <th class="py-2.5 px-4">Failed Attempts</th>
                      <th class="py-2.5 px-4">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr
                      v-for="team in selectedChallengeAnalytics.teamStats"
                      :key="team.teamId"
                      class="hover:bg-white/5 transition"
                    >
                      <td class="py-2.5 px-4 font-bold text-cyber-secondary">{{ team.teamName }}</td>
                      <td class="py-2.5 px-4">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          :class="{
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': team.status === 'completed',
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': team.status === 'active',
                            'bg-red-500/10 text-red-500 border border-red-500/20': team.status === 'expired'
                          }"
                        >
                          {{ team.status }}
                        </span>
                      </td>
                      <td class="py-2.5 px-4 font-bold text-cyber-primary">
                        {{ team.questionsDetail.filter(q => q.solved).length }} / {{ team.questionsDetail.length }}
                      </td>
                      <td class="py-2.5 px-4 text-rose-400 font-bold">{{ team.failedAttempts }}</td>
                      <td class="py-2.5 px-4 text-slate-500">{{ new Date(team.openedAt).toLocaleString() }}</td>
                    </tr>
                    <tr v-if="!selectedChallengeAnalytics.teamStats || selectedChallengeAnalytics.teamStats.length === 0">
                      <td colspan="5" class="text-center py-4 text-slate-500">
                        No team sessions found for this challenge.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="py-12 flex justify-center items-center text-slate-400 font-mono text-xs"
        >
          🔄 Connecting to server and downloading analytics...
        </div>

        <div class="flex justify-end border-t border-white/10 pt-4">
          <button
            @click="showChallengeAnalyticsModal = false"
            class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10"
          >
            CLOSE ANALYTICS
          </button>
        </div>
      </div>
    </div>

    <!-- DATABASE DELETE CONFIRMATION MODAL -->
    <div
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto"
    >
      <div
        class="relative w-full max-w-md bg-[#0B1020] border border-white/10 rounded-lg p-6 space-y-6 glass-panel font-mono text-xs"
      >
        <div class="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 class="text-sm font-bold text-red-500 uppercase flex items-center gap-1.5">
            <svg class="w-4 h-4 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Delete All Data
          </h3>
          <button
            @click="closeDeleteConfirmModal"
            class="text-slate-400 hover:text-white text-lg font-mono"
          >
            ×
          </button>
        </div>

        <div class="space-y-3">
          <p class="text-slate-300">
            Are you sure you want to permanently delete all data from this collection? This action cannot be undone.
          </p>
          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] text-red-400">
            Target Collection: <span class="font-bold text-white uppercase">{{ targetCollectionName }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="closeDeleteConfirmModal"
            class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded text-slate-300 transition uppercase"
          >
            Cancel
          </button>
          <button
            @click="executeDeleteCollection"
            :disabled="deleteLoading"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-[#0B1020] hover:text-white text-xs font-bold rounded transition uppercase shadow-neon-danger disabled:opacity-50"
          >
            {{ deleteLoading ? "DELETING..." : "Delete Permanently" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import VueApexCharts from "vue3-apexcharts";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import api from "../utils/api.js";

const toast = useToast();
const apexchart = VueApexCharts;

// Sidebar navigation control variable
const activeSection = ref("dashboard");

const dragOverImage = ref(false);
const challengeImageInput = ref(null);

// 1. AUTHENTICATION & LOGIN LOGIC
const isAuthenticated = ref(!!localStorage.getItem("adminToken"));
const adminUser = ref(JSON.parse(localStorage.getItem("adminUser") || "null"));
const loginLoading = ref(false);
const loginForm = ref({ usernameOrEmail: "", password: "", captchaAnswer: "" });

const loginCaptchaQuestion = ref("");
const loginCaptchaId = ref("");

const loadLoginCaptcha = async () => {
  try {
    const res = await api.get("/auth/captcha");
    loginCaptchaId.value = res.data.data.captchaId;
    loginCaptchaQuestion.value = res.data.data.question;
  } catch (error) {
    toast.error("Failed to load validation captcha");
  }
};

const handleLogin = async () => {
  loginLoading.value = true;
  try {
    const res = await api.post("/auth/login", {
      usernameOrEmail: loginForm.value.usernameOrEmail,
      password: loginForm.value.password,
      captchaId: loginCaptchaId.value,
      captchaAnswer: loginForm.value.captchaAnswer,
      deviceName: "Admin Dashboard Client",
    });

    const { accessToken, refreshToken, user } = res.data.data;
    if (!user.roles.includes("admin") && !user.roles.includes("staff")) {
      toast.error(
        "Access Denied: Operators require Admin/Staff signature key.",
      );
      return;
    }

    localStorage.setItem("adminToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("adminRefreshToken", refreshToken);
    }
    localStorage.setItem("adminUser", JSON.stringify(user));
    adminUser.value = user;
    isAuthenticated.value = true;
    toast.success(`Secure link established. Welcome, ${user.username}!`);
    loadAllData();
  } catch (error) {
    loginForm.value.captchaAnswer = "";
    loadLoginCaptcha();
    const errorMsg = error?.error?.message || "Invalid validation credentials";
    toast.error(errorMsg);
  } finally {
    loginLoading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");
  adminUser.value = null;
  isAuthenticated.value = false;
  toast.info("Secure link terminated.");
  loadLoginCaptcha();
};

// 2. DASHBOARD DATA STATES
const stats = ref({ users: 0, teams: 0, ctfs: 0, hackathons: 0 });
const challenges = ref([]);
const hackathons = ref([]);
const logs = ref([]);

// Line Chart: registrations velocity
const velocityChartSeries = ref([{ name: "Registrations", data: [] }]);
const velocityChartOptions = ref({
  chart: { toolbar: { show: false } },
  colors: ["#7C3AED"],
  xaxis: {
    categories: [],
    labels: { style: { colors: "#64748B" } },
  },
  stroke: { curve: "smooth", width: 3 },
  theme: { mode: "dark" },
});

// Bar Chart: challenges by category
const categoryChartSeries = ref([{ name: "Challenges", data: [] }]);
const categoryChartOptions = ref({
  chart: { toolbar: { show: false } },
  colors: ["#00D4FF"],
  xaxis: {
    categories: [],
    labels: { style: { colors: "#64748B" } },
  },
  theme: { mode: "dark" },
});

const loadAllData = async () => {
  if (!isAuthenticated.value) return;
  try {
    await Promise.all([
      loadStats(),
      loadChallenges(),
      loadHackathons(),
      loadAuditLogs(),
      loadDbCounts(),
    ]);
  } catch (error) {
    console.error("Failed to load initial metrics", error);
  }
};

const loadStats = async () => {
  try {
    const res = await api.get("/admin/stats");
    const { counts, registrationVelocity, categoryStats } = res.data.data;

    stats.value = {
      users: counts.users || 0,
      teams: counts.teams || 0,
      ctfs: counts.ctfs || 0,
      hackathons: counts.hackathons || 0,
    };

    if (registrationVelocity && registrationVelocity.length > 0) {
      velocityChartSeries.value = [
        {
          name: "Registrations",
          data: registrationVelocity.map((v) => v.count),
        },
      ];
      velocityChartOptions.value = {
        ...velocityChartOptions.value,
        xaxis: {
          categories: registrationVelocity.map((v) => v._id),
          labels: { style: { colors: "#64748B" } },
        },
      };
    }

    if (categoryStats && categoryStats.length > 0) {
      categoryChartSeries.value = [
        {
          name: "Challenges",
          data: categoryStats.map((c) => c.count),
        },
      ];
      categoryChartOptions.value = {
        ...categoryChartOptions.value,
        xaxis: {
          categories: categoryStats.map((c) => c._id),
          labels: { style: { colors: "#64748B" } },
        },
      };
    }
  } catch (err) {
    toast.error("Failed to resolve system stats.");
  }
};

const loadChallenges = async () => {
  try {
    const res = await api.get("/ctfs");
    challenges.value = res.data.data;
  } catch (err) {
    toast.error("Failed to fetch challenges.");
  }
};

const loadHackathons = async () => {
  try {
    const res = await api.get("/hackathons");
    hackathons.value = res.data.data;
  } catch (err) {
    toast.error("Failed to fetch hackathons list.");
  }
};

const loadAuditLogs = async () => {
  try {
    const res = await api.get("/admin/logs");
    logs.value = res.data.data;
  } catch (err) {
    toast.error("Failed to fetch audit logs.");
  }
};

// Association classes and texts
const getChallengeAssociation = (challengeId) => {
  const match = hackathons.value.find(
    (h) => h.challenges && h.challenges.includes(challengeId),
  );
  return match ? `Arena: ${match.name}` : "Permanent";
};

const getAssociationClass = (challengeId) => {
  const match = hackathons.value.find(
    (h) => h.challenges && h.challenges.includes(challengeId),
  );
  return match
    ? "bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30"
    : "bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30";
};

const getDifficultyClass = (difficulty) => {
  if (difficulty === "easy") return "bg-green-500/20 text-green-400";
  if (difficulty === "medium") return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
};

const getHackathonStatusClass = (status) => {
  if (status === "active")
    return "bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30";
  if (status === "upcoming")
    return "bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/30";
  return "bg-slate-700/20 text-slate-400 border border-slate-700";
};

const handleStatusChange = async (challengeId, newStatus) => {
  try {
    await api.put(`/ctfs/${challengeId}/status`, { status: newStatus });
    toast.success(`Challenge status changed to ${newStatus}`);
    loadChallenges();
    loadStats();
  } catch (err) {
    toast.error(err?.error?.message || "Status transition failed.");
  }
};

const handleHackathonStatusChange = async (h, newStatus) => {
  try {
    toast.info("Xakaton holati yangilanmoqda...");
    const payload = {
      name: h.name,
      description: h.description,
      hackathonStart: new Date(h.hackathonStart).toISOString(),
      hackathonEnd: new Date(h.hackathonEnd).toISOString(),
      maxTeams: h.maxTeams,
      coverImage:
        h.coverImage ||
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      banner:
        h.banner ||
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      challenges: (h.challenges || []).map((c) =>
        typeof c === "object" && c._id ? c._id : c,
      ),
      status: newStatus,
    };
    await api.put(`/admin/hackathons/${h._id}`, payload);
    toast.success(
      `Xakaton holati "${newStatus}" ga muvaffaqiyatli o'zgartirildi!`,
    );
    loadHackathons();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || "Xakaton holatini yangilashda xatolik.");
  }
};

const handleDelete = async (challengeId) => {
  if (!confirm("Are you sure you want to terminate this challenge node?"))
    return;
  try {
    await api.delete(`/ctfs/${challengeId}`);
    toast.success("Challenge node successfully deleted.");
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || "Failed to delete challenge.");
  }
};

const promptResetProgress = async (type, targetId = null) => {
  try {
    const url = `/admin/reset/info?type=${type}${targetId ? '&targetId=' + targetId : ''}`;
    const infoRes = await api.get(url);
    const details = infoRes.data.data.details;
    
    let confirmMsg = "";
    if (type === 'challenge') {
      confirmMsg = `Are you sure you want to reset all user/team progress for the challenge "${details.title}"?\n\nThis will delete:\n- ${details.activeSessions || 0} active practice sessions\n- ${details.activeTeamSessions || 0} active hackathon sessions\n- ${details.totalSolves || 0} total solves\n\nScores and leaderboards will be dynamically recalculated. This action is irreversible!`;
    } else if (type === 'ctf') {
      confirmMsg = `Are you sure you want to reset progress for ALL practice CTF challenges?\n\nThis will delete:\n- ${details.activeSessions || 0} active sessions\n- ${details.totalPracticeSolves || 0} practice solves\n\nScores and leaderboards will be recalculated. This action is irreversible!`;
    } else if (type === 'hackathon') {
      confirmMsg = `Are you sure you want to reset all team progress for the hackathon "${details.name}"?\n\nThis will delete:\n- ${details.activeTeamSessions || 0} team sessions\n- ${details.totalSolves || 0} solves\n\nScores and leaderboards will be recalculated. This action is irreversible!`;
    }

    if (!confirm(confirmMsg)) return;

    const res = await api.post('/admin/reset', { type, targetId });
    toast.success(res.data.message || "Progress reset successfully.");
    
    loadChallenges();
    loadHackathons();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    const errorMsg = err?.error?.message || "Failed to reset progress.";
    toast.error(errorMsg);
  }
};

// 3. CREATE & EDIT CTF MODAL SYSTEM
const showModal = ref(false);
const isEditing = ref(false);
const editingChallengeId = ref(null);
const editor = ref(null);
const challengeAttachmentInput = ref(null);

const form = ref({
  title: "",
  shortDescription: "",
  category: "Web",
  difficulty: "easy",
  stars: 1,
  timerMinutes: 60,
  image: "",
  attachments: [],
  hint: "",
  flags: [{ flag: "", points: 100, hint: "" }],
  questions: [],
});

const openCreateModal = () => {
  isEditing.value = false;
  editingChallengeId.value = null;
  form.value = {
    title: "",
    shortDescription: "",
    category: "Web",
    difficulty: "easy",
    stars: 1,
    timerMinutes: 60,
    image: "",
    attachments: [],
    hint: "",
    flags: [{ flag: "", points: 100, hint: "" }],
    questions: [],
  };

  showModal.value = true;
  initEditor("");
};

const openEditModal = (ctf) => {
  isEditing.value = true;
  editingChallengeId.value = ctf._id;

  const mappedQuestions = (ctf.questions || []).map((q) => ({
    title: q.title,
    description: q.description || "",
    type: q.type || "text",
    options: q.options && Array.isArray(q.options) ? [...q.options] : [],
    correctAnswer: q.correctAnswer || q.answer || "",
    points: q.points !== undefined ? q.points : 10,
    hint: q.hint || "",
  }));

  const mappedFlags = (ctf.flags || []).map((f) => {
    if (typeof f === "object" && f !== null) {
      return {
        flag: f.flag || "",
        points: f.points !== undefined ? f.points : 100,
        hint: f.hint || "",
      };
    }
    return {
      flag: f || "",
      points: 100,
      hint: "",
    };
  });

  form.value = {
    title: ctf.title,
    shortDescription: ctf.shortDescription,
    category: ctf.category,
    difficulty: ctf.difficulty,
    stars: ctf.stars,
    timerMinutes: ctf.timerMinutes || 60,
    image: ctf.image || "",
    attachments:
      ctf.attachments && ctf.attachments.length > 0 ? [...ctf.attachments] : [],
    hint: ctf.hint || "",
    flags: mappedFlags.length > 0 ? mappedFlags : [{ flag: "", points: 100, hint: "" }],
    questions: mappedQuestions,
  };

  showModal.value = true;
  initEditor(ctf.longDescription);
};

const closeModal = () => {
  showModal.value = false;
  destroyEditor();
};

const initEditor = (content) => {
  setTimeout(() => {
    editor.value = new Editor({
      content:
        content || "<p>Detailed challenge walkthrough and instructions...</p>",
      extensions: [StarterKit],
    });
  }, 100);
};

const destroyEditor = () => {
  editor.value?.destroy();
  editor.value = null;
};

const addQuestionNode = () => {
  form.value.questions.push({
    title: "",
    description: "",
    type: "text",
    options: [],
    correctAnswer: "",
    points: 10,
    hint: "",
  });
};

const removeQuestionNode = (index) => {
  form.value.questions.splice(index, 1);
};

const addFlagNode = () => {
  if (form.value.flags.length >= 3) {
    toast.warning("Maximum 3 flags permitted per challenge.");
    return;
  }
  form.value.flags.push({ flag: "", points: 100, hint: "" });
};

const removeFlagNode = (index) => {
  if (form.value.flags.length <= 1) {
    toast.warning("At least 1 flag is required.");
    return;
  }
  form.value.flags.splice(index, 1);
};

const submitChallenge = async () => {
  if (form.value.flags.length < 1 || form.value.flags.length > 3) {
    toast.error(
      "Validation Error: A challenge must contain between 1 and 3 flags.",
    );
    return;
  }

  if (form.value.flags.some((f) => !f.flag || !f.flag.trim())) {
    toast.error("Validation Error: Flags cannot be empty.");
    return;
  }

  const longDescriptionHtml = editor.value?.getHTML() || "";

  const formattedQuestions = form.value.questions.map((q) => {
    return {
      title: q.title,
      description: q.description || "",
      type: q.type || "text",
      options: q.options || [],
      correctAnswer: q.correctAnswer || q.answer,
      points: q.points !== undefined ? q.points : 10,
      hint: q.hint || "",
    };
  });

  const payload = {
    title: form.value.title,
    shortDescription: form.value.shortDescription,
    longDescription: longDescriptionHtml,
    difficulty: form.value.difficulty,
    stars: form.value.stars,
    category: form.value.category,
    timerMinutes: form.value.timerMinutes,
    image: form.value.image,
    attachments: form.value.attachments || [],
    hint: form.value.hint || "",
    flags: form.value.flags.map((f) => ({
      flag: f.flag.trim(),
      points: f.points !== undefined ? f.points : 100,
      hint: f.hint ? f.hint.trim() : "",
    })),
    questions: formattedQuestions,
  };

  try {
    if (isEditing.value) {
      await api.put(`/ctfs/${editingChallengeId.value}`, payload);
      toast.success("Challenge updated successfully!");
    } else {
      await api.post("/ctfs", payload);
      toast.success("Challenge deployed successfully in draft mode.");
    }

    closeModal();
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || "Deployment validation failed.");
  }
};

// 4. HACKATHON MODAL MANAGEMENT
const showHackathonModal = ref(false);
const editingHackathonId = ref("");
const hackathonLoading = ref(false);
const hackathonCoverInput = ref(null);
const selectableChallenges = ref([]);

const hackathonForm = ref({
  name: "",
  description: "",
  hackathonStart: "",
  hackathonEnd: "",
  maxTeams: 50,
  coverImage: "",
  challenges: [],
  status: "open",
});

const loadSelectableChallenges = async (hackathonId = "new") => {
  try {
    const res = await api.get(`/ctfs?availableForHackathon=${hackathonId}`);
    selectableChallenges.value = res.data.data;
  } catch (err) {
    toast.error("Failed to fetch selectable challenges.");
  }
};

const openHackathonModal = async () => {
  editingHackathonId.value = "";
  hackathonForm.value = {
    name: "",
    description: "",
    hackathonStart: "",
    hackathonEnd: "",
    maxTeams: 50,
    coverImage: "",
    challenges: [],
    status: "open",
  };
  await loadSelectableChallenges("new");
  showHackathonModal.value = true;
};

const closeHackathonModal = () => {
  showHackathonModal.value = false;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const editHackathon = async (h) => {
  editingHackathonId.value = h._id;
  hackathonForm.value = {
    name: h.name,
    description: h.description,
    hackathonStart: formatDateForInput(h.hackathonStart),
    hackathonEnd: formatDateForInput(h.hackathonEnd),
    maxTeams: h.maxTeams,
    coverImage: h.coverImage || "",
    challenges: h.challenges || [],
    status: h.status || "open",
  };
  await loadSelectableChallenges(h._id);
  showHackathonModal.value = true;
};

const deleteHackathonPrompt = async (h) => {
  const confirmDelete = confirm(
    `Are you sure you want to permanently delete hackathon "${h.name}"? This will clear all news reports and team logs bound to it.`,
  );
  if (!confirmDelete) return;

  try {
    toast.info("Decomposing hackathon registry...");
    await api.delete(`/admin/hackathons/${h._id}`);
    toast.success("Hackathon completely deleted.");
    loadHackathons();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || "Decomposition script error.");
  }
};

// Hackathon analytics monitor logic
const showStatsModal = ref(false);
const selectedHackathonStats = ref(null);
const currentHackathonId = ref("");
const activeStatsTab = ref("live"); // 'live' or 'questions'
const expandedQuestions = ref({});

const toggleQuestion = (qId) => {
  expandedQuestions.value[qId] = !expandedQuestions.value[qId];
};

const openHackathonAnalytics = async (hackathonId) => {
  currentHackathonId.value = hackathonId;
  selectedHackathonStats.value = null;
  activeStatsTab.value = "live";
  expandedQuestions.value = {};
  showStatsModal.value = true;
  await fetchAnalyticsData(hackathonId);
};

const fetchAnalyticsData = async (hackathonId) => {
  try {
    const res = await api.get(`/admin/hackathons/${hackathonId}/stats`);
    selectedHackathonStats.value = res.data.data;
  } catch (err) {
    toast.error(
      err?.error?.message || "Failed to download hackathon analytics data.",
    );
    showStatsModal.value = false;
  }
};

const refreshHackathonStats = async () => {
  if (currentHackathonId.value) {
    await fetchAnalyticsData(currentHackathonId.value);
    toast.success("Analytics logs successfully refreshed.");
  }
};

// Challenge analytics monitor logic
const showChallengeAnalyticsModal = ref(false);
const selectedChallengeAnalytics = ref(null);
const currentChallengeIdForAnalytics = ref("");
const activeChallengeTab = ref("questions"); // 'questions' or 'participants'
const expandedChallengeQuestions = ref({});

const toggleChallengeQuestion = (qId) => {
  expandedChallengeQuestions.value[qId] = !expandedChallengeQuestions.value[qId];
};

const openChallengeAnalytics = async (challengeId) => {
  currentChallengeIdForAnalytics.value = challengeId;
  selectedChallengeAnalytics.value = null;
  activeChallengeTab.value = "questions";
  expandedChallengeQuestions.value = {};
  showChallengeAnalyticsModal.value = true;
  await fetchChallengeAnalytics(challengeId);
};

const fetchChallengeAnalytics = async (challengeId) => {
  try {
    const res = await api.get(`/admin/ctfs/${challengeId}/analytics`);
    selectedChallengeAnalytics.value = res.data.data;
  } catch (err) {
    toast.error(
      err?.error?.message || "Failed to download challenge analytics data.",
    );
    showChallengeAnalyticsModal.value = false;
  }
};

const refreshChallengeAnalytics = async () => {
  if (currentChallengeIdForAnalytics.value) {
    await fetchChallengeAnalytics(currentChallengeIdForAnalytics.value);
    toast.success("Analytics logs successfully refreshed.");
  }
};

const getQuestionParticipantStats = (questionId) => {
  if (!selectedChallengeAnalytics.value) return [];
  const stats = [];
  
  // Extract from user stats
  (selectedChallengeAnalytics.value.userStats || []).forEach(user => {
    const qDetail = (user.questionsDetail || []).find(qd => qd.questionId === questionId);
    if (qDetail && (qDetail.solved || qDetail.failedAttempts > 0)) {
      stats.push({
        id: user.userId,
        name: `@${user.username}`,
        subtext: user.fullName,
        type: 'user',
        failedAttempts: qDetail.failedAttempts,
        solved: qDetail.solved,
        solvedAt: qDetail.solvedAt
      });
    }
  });

  // Extract from team stats
  (selectedChallengeAnalytics.value.teamStats || []).forEach(team => {
    const qDetail = (team.questionsDetail || []).find(qd => qd.questionId === questionId);
    if (qDetail && (qDetail.solved || qDetail.failedAttempts > 0)) {
      stats.push({
        id: team.teamId,
        name: team.teamName,
        subtext: '',
        type: 'team',
        failedAttempts: qDetail.failedAttempts,
        solved: qDetail.solved,
        solvedAt: qDetail.solvedAt
      });
    }
  });

  return stats.sort((a, b) => {
    if (a.solved && !b.solved) return -1;
    if (!a.solved && b.solved) return 1;
    return b.failedAttempts - a.failedAttempts;
  });
};


const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) return "Expired";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let result = "";
  if (hrs > 0) result += `${hrs}h `;
  if (mins > 0 || hrs > 0) result += `${mins}m `;
  result += `${secs}s`;
  return result;
};

// Upload Hackathon Cover/Banner image
const onHackathonCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    toast.info("Uploading banner image...");
    const res = await api.post("/ctfs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    hackathonForm.value.coverImage = res.data.data.url;
    toast.success("Banner uploaded successfully!");
  } catch (error) {
    toast.error(error?.error?.message || "Banner upload failed");
  }
};

// Upload Challenge Image via drag-and-drop or click selector
const uploadChallengeImageFile = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    toast.info("Uploading challenge image...");
    const res = await api.post("/ctfs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    form.value.image = res.data.data.url;
    toast.success("Image uploaded successfully!");
  } catch (error) {
    toast.error(error?.error?.message || "Image upload failed");
  }
};

const onChallengeImageUpload = (event) => {
  const file = event.target.files[0];
  uploadChallengeImageFile(file);
};

const onChallengeAttachmentUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    toast.info("Uploading file...");
    const res = await api.post("/ctfs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!form.value.attachments) {
      form.value.attachments = [];
    }
    form.value.attachments.push(res.data.data.url);
    toast.success("File uploaded successfully!");
  } catch (error) {
    toast.error(error?.error?.message || "File upload failed");
  }
};

const removeChallengeAttachment = (index) => {
  form.value.attachments.splice(index, 1);
};

const onChallengeImageDrop = (event) => {
  dragOverImage.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    uploadChallengeImageFile(file);
  } else {
    toast.error("Only image files are allowed");
  }
};

const submitHackathon = async () => {
  hackathonLoading.value = true;
  try {
    const payload = {
      name: hackathonForm.value.name,
      description: hackathonForm.value.description,
      hackathonStart: new Date(
        hackathonForm.value.hackathonStart,
      ).toISOString(),
      hackathonEnd: new Date(hackathonForm.value.hackathonEnd).toISOString(),
      maxTeams: hackathonForm.value.maxTeams,
      coverImage:
        hackathonForm.value.coverImage ||
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      banner:
        hackathonForm.value.coverImage ||
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      challenges: hackathonForm.value.challenges,
    };

    if (editingHackathonId.value) {
      payload.status = hackathonForm.value.status;
      await api.put(`/admin/hackathons/${editingHackathonId.value}`, payload);
      toast.success("Hackathon arena successfully updated!");
    } else {
      await api.post("/admin/hackathons", payload);
      toast.success("New hackathon arena successfully deployed!");
    }
    closeHackathonModal();
    loadHackathons();
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (error) {
    const errorMsg =
      error?.error?.message || "Failed to submit hackathon configuration.";
    toast.error(errorMsg);
  } finally {
    hackathonLoading.value = false;
  }
};

// 5. SETTINGS FORM OPERATIONS
const roleForm = ref({ targetUserId: "", action: "add", role: "staff" });
const roleLoading = ref(false);

const submitRoleChange = async () => {
  roleLoading.value = true;
  try {
    const res = await api.post("/admin/roles", roleForm.value);
    toast.success(res.data.message);
    roleForm.value.targetUserId = "";
    loadAuditLogs();
    loadStats();
  } catch (error) {
    toast.error(error?.error?.message || "Role change submission failed.");
  } finally {
    roleLoading.value = false;
  }
};

// Simulated platform settings stored in localStorage
const simulatedSettings = ref({
  maintenanceMode: localStorage.getItem("cfg_maintenance") === "true",
  strictPasswords: localStorage.getItem("cfg_strict_pass") === "true",
  rateLimit: parseInt(localStorage.getItem("cfg_rate_limit") || "30"),
});

const toggleSimulatedSetting = (key) => {
  simulatedSettings.value[key] = !simulatedSettings.value[key];
  localStorage.setItem(
    `cfg_${key === "maintenanceMode" ? "maintenance" : "strict_pass"}`,
    simulatedSettings.value[key],
  );
  toast.success(`Platform setting ${key} successfully toggled.`);
};

const adjustRateLimit = (delta) => {
  simulatedSettings.value.rateLimit = Math.max(
    5,
    Math.min(200, simulatedSettings.value.rateLimit + delta),
  );
  localStorage.setItem("cfg_rate_limit", simulatedSettings.value.rateLimit);
};

// Database Management Operations (Super Admin only)
const dbCounts = ref({ users: 0, questions: 0 });
const dbCountsLoading = ref(false);
const showDeleteConfirmModal = ref(false);
const targetCollectionName = ref("");
const deleteLoading = ref(false);

const loadDbCounts = async () => {
  if (adminUser.value?.username !== 'superadmin') return;
  dbCountsLoading.value = true;
  try {
    const res = await api.get("/admin/db/counts");
    dbCounts.value = res.data.data;
  } catch (error) {
    console.error("Failed to load database counts", error);
  } finally {
    dbCountsLoading.value = false;
  }
};

const confirmDeleteCollection = (collectionName) => {
  targetCollectionName.value = collectionName;
  showDeleteConfirmModal.value = true;
};

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false;
  targetCollectionName.value = "";
};

const executeDeleteCollection = async () => {
  if (!targetCollectionName.value) return;
  deleteLoading.value = true;
  try {
    const res = await api.post("/admin/db/delete", {
      collectionName: targetCollectionName.value,
    });
    toast.success(res.data.message || "Data successfully deleted.");
    // Automatically update collection count to 0 without page refresh
    if (targetCollectionName.value === "users") {
      dbCounts.value.users = 0;
    } else if (targetCollectionName.value === "questions") {
      dbCounts.value.questions = 0;
    }
    closeDeleteConfirmModal();
    // Refresh other statistics
    loadStats();
    loadAuditLogs();
  } catch (error) {
    toast.error(error?.response?.data?.error?.message || error?.error?.message || "Failed to delete collection data.");
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(() => {
  window.addEventListener('admin-logout', handleLogout);
  if (!isAuthenticated.value) {
    loadLoginCaptcha();
  } else {
    loadAllData();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('admin-logout', handleLogout);
  destroyEditor();
});
</script>

<style>
.glass-panel {
  background: rgba(15, 22, 42, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
.shadow-neon-primary {
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.25);
}
.shadow-neon-secondary {
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.25);
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
