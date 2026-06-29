<template>
  <div class="min-h-screen bg-[#0B1020] text-slate-200">
    <!-- 1. LOGIN OVERLAY (If not authenticated) -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div class="absolute top-1/4 left-1/4 h-[350px] w-[350px] bg-cyber-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] bg-cyber-accent/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="w-full max-w-md p-8 rounded-lg glass-panel border border-white/10 relative z-10 space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-extrabold font-mono tracking-wider text-cyber-primary">
            // ADMIN.<span class="text-cyber-secondary">CONSOLE</span>
          </h1>
          <p class="text-xs text-slate-400">SECURE MANAGEMENT ACCESS TERMINAL</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs uppercase font-mono tracking-wider text-slate-400 block">Operator Credentials</label>
            <input
              v-model="loginForm.usernameOrEmail"
              type="text"
              placeholder="Username or Email"
              class="w-full bg-[#0B1020] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
              required
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs uppercase font-mono tracking-wider text-slate-400 block">Security Password</label>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••••••"
              class="w-full bg-[#0B1020] border border-white/10 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loginLoading"
            class="w-full py-2.5 rounded font-mono text-sm font-bold bg-cyber-primary text-[#0B1020] transition hover:bg-cyber-primary/90 focus:outline-none shadow-neon-primary disabled:opacity-50"
          >
            {{ loginLoading ? 'AUTHENTICATING...' : 'ACCESS CONTROL' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 2. MAIN SIDEBAR LAYOUT (If authenticated) -->
    <div v-else class="flex min-h-screen">
      
      <!-- LEFT SIDEBAR -->
      <aside class="w-64 bg-[#131C35] border-r border-white/10 flex flex-col justify-between shrink-0">
        <div class="space-y-6 p-6">
          <div class="border-b border-white/5 pb-4">
            <span class="text-lg font-bold tracking-wider font-mono text-cyber-primary block">
              // CONTROL.<span class="text-cyber-accent">NODE</span>
            </span>
            <span class="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mt-1">Global Scope Console</span>
          </div>

          <!-- Navigation Menu Links -->
          <nav class="space-y-2">
            <button
              @click="activeSection = 'dashboard'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="activeSection === 'dashboard' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary' : 'text-slate-400'"
            >
              <span class="mr-3 text-base">📊</span> DASHBOARD OVERVIEW
            </button>

            <button
              @click="activeSection = 'ctfs'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="activeSection === 'ctfs' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary' : 'text-slate-400'"
            >
              <span class="mr-3 text-base">💾</span> CTF DATABASE
            </button>

            <button
              @click="activeSection = 'hackathons'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="activeSection === 'hackathons' ? 'bg-cyber-secondary/10 text-cyber-secondary border border-cyber-secondary/20 shadow-neon-secondary' : 'text-slate-400'"
            >
              <span class="mr-3 text-base">⚡</span> HACKATHONS ARENA
            </button>

            <button
              @click="activeSection = 'logs'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="activeSection === 'logs' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary' : 'text-slate-400'"
            >
              <span class="mr-3 text-base">🔍</span> SECURITY LOGS
            </button>

            <button
              @click="activeSection = 'settings'"
              class="w-full flex items-center px-4 py-2.5 rounded text-xs font-mono font-bold transition hover:bg-white/5"
              :class="activeSection === 'settings' ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 shadow-neon-primary' : 'text-slate-400'"
            >
              <span class="mr-3 text-base">⚙️</span> SETTINGS CONSOLE
            </button>
          </nav>
        </div>

        <!-- Sidebar footer operator capsule -->
        <div class="p-6 border-t border-white/5 bg-[#0B1020]/50 space-y-3 font-mono text-[10px]">
          <div class="space-y-1">
            <span class="text-slate-500 block uppercase">Active Operator</span>
            <span class="font-bold text-white block">{{ adminUser?.username }}</span>
            <span class="text-cyber-accent block">{{ adminUser?.email }}</span>
          </div>
          <button @click="handleLogout" class="w-full py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded hover:border-red-500/40 transition">
            DISCONNECT NODE
          </button>
        </div>
      </aside>

      <!-- RIGHT CONTENT CONTAINER -->
      <main class="flex-1 min-w-0 bg-[#0B1020] p-8 overflow-y-auto space-y-8">
        
        <!-- Navbar Breadcrumb header -->
        <header class="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <div>
            <h2 class="text-xl font-bold font-mono text-white tracking-wider uppercase">
              // System.{{ activeSection }}
            </h2>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Platform management console node status: ACTIVE</p>
          </div>
          <div class="text-xs font-mono text-slate-400">Time: {{ new Date().toLocaleTimeString() }}</div>
        </header>

        <!-- SECTION A: DASHBOARD OVERVIEW -->
        <section v-if="activeSection === 'dashboard'" class="space-y-8 animate-fade-in">
          <!-- Metrics Overview Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1">
              <span class="text-[10px] text-slate-400 block uppercase font-mono">Total Operators</span>
              <span class="text-2xl font-extrabold text-white font-mono">{{ stats.users }}</span>
            </div>
            <div class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1">
              <span class="text-[10px] text-slate-400 block uppercase font-mono">Assigned Teams</span>
              <span class="text-2xl font-extrabold text-cyber-primary font-mono">{{ stats.teams }}</span>
            </div>
            <div class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1">
              <span class="text-[10px] text-slate-400 block uppercase font-mono">Active CTFs</span>
              <span class="text-2xl font-extrabold text-cyber-secondary font-mono">{{ stats.ctfs }}</span>
            </div>
            <div class="p-5 rounded-lg bg-cyber-card border border-white/5 space-y-1">
              <span class="text-[10px] text-slate-400 block uppercase font-mono">Completed Hackathons</span>
              <span class="text-2xl font-extrabold text-cyber-accent font-mono">{{ stats.hackathons }}</span>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Velocity Chart -->
            <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-2">
              <h3 class="text-sm font-bold font-mono text-white">// USER REGISTRATION VELOCITY (LAST 14 DAYS)</h3>
              <div v-if="velocityChartSeries[0].data.length > 0">
                <apexchart type="line" height="280" :options="velocityChartOptions" :series="velocityChartSeries"></apexchart>
              </div>
              <div v-else class="h-[280px] flex items-center justify-center text-xs text-slate-500 font-mono">
                Gathering activity vectors...
              </div>
            </div>
            <!-- Category Chart -->
            <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-2">
              <h3 class="text-sm font-bold font-mono text-white">// CHALLENGES BY CATEGORY RANGE</h3>
              <div v-if="categoryChartSeries[0].data.length > 0">
                <apexchart type="bar" height="280" :options="categoryChartOptions" :series="categoryChartSeries"></apexchart>
              </div>
              <div v-else class="h-[280px] flex items-center justify-center text-xs text-slate-500 font-mono">
                Reading challenge metadata...
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION B: CTF DATABASE -->
        <section v-if="activeSection === 'ctfs'" class="space-y-6 animate-fade-in">
          <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
            <div class="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 class="text-sm font-bold font-mono text-white uppercase tracking-wider">
                // ACTIVE CHALLENGES REGISTRY
              </h3>
              <button @click="openCreateModal" class="px-4 py-1.5 bg-cyber-primary text-[#0B1020] text-xs font-bold font-mono rounded hover:bg-cyber-primary/90 transition shadow-neon-primary">
                + DEPLOY NEW CHALLENGE
              </button>
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
                  <tr v-for="ctf in challenges" :key="ctf._id" class="hover:bg-white/5 transition">
                    <td class="py-3 px-4 font-bold text-white">{{ ctf.title }}</td>
                    <td class="py-3 px-4">{{ ctf.category }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded font-bold" :class="getDifficultyClass(ctf.difficulty)">
                        {{ ctf.difficulty.toUpperCase() }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-cyber-primary">★ {{ ctf.stars }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded font-bold text-[10px]" :class="getAssociationClass(ctf._id)">
                        {{ getChallengeAssociation(ctf._id) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <select :value="ctf.status" @change="handleStatusChange(ctf._id, $event.target.value)" class="bg-[#0B1020] border border-white/15 rounded text-[10px] px-1 py-0.5 focus:outline-none">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-slate-300 font-bold">{{ ctf.questions?.length || 0 }} / 10</td>
                    <td class="py-3 px-4 text-slate-400">{{ ctf.author?.username || 'Unknown' }}</td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <button @click="openEditModal(ctf)" class="text-cyber-secondary hover:underline">Edit</button>
                      <button @click="handleDelete(ctf._id)" class="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                  <tr v-if="challenges.length === 0">
                    <td colspan="9" class="text-center py-6 text-slate-500">No challenges detected. Deploy new units above.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SECTION C: HACKATHONS ARENA -->
        <section v-if="activeSection === 'hackathons'" class="space-y-6 animate-fade-in">
          <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
            <div class="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 class="text-sm font-bold font-mono text-white uppercase tracking-wider">
                // HACKATHONS ARENA REGISTRY
              </h3>
              <button @click="openHackathonModal" class="px-4 py-1.5 bg-cyber-secondary text-[#0B1020] text-xs font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary">
                + DEPLOY NEW HACKATHON
              </button>
            </div>

            <!-- Hackathon Table List -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400">
                    <th class="py-3 px-4">Name</th>
                    <th class="py-3 px-4">Registration Window</th>
                    <th class="py-3 px-4">Execution Window</th>
                    <th class="py-3 px-4">Max Teams</th>
                    <th class="py-3 px-4">Challenges</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="h in hackathons" :key="h._id" class="hover:bg-white/5 transition">
                    <td class="py-3 px-4 font-bold text-white">{{ h.name }}</td>
                    <td class="py-3 px-4 text-slate-400">
                      {{ new Date(h.registrationStart).toLocaleDateString() }} - {{ new Date(h.registrationEnd).toLocaleDateString() }}
                    </td>
                    <td class="py-3 px-4 text-slate-300">
                      {{ new Date(h.hackathonStart).toLocaleDateString() }} - {{ new Date(h.hackathonEnd).toLocaleDateString() }}
                    </td>
                    <td class="py-3 px-4">{{ h.maxTeams }} Teams</td>
                    <td class="py-3 px-4 text-cyber-secondary font-bold">{{ h.challenges?.length || 0 }} Units</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded font-bold uppercase" :class="getHackathonStatusClass(h.status)">
                        {{ h.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button @click="openHackathonAnalytics(h._id)" class="px-2.5 py-1 bg-cyber-primary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-primary/90 transition shadow-neon-primary uppercase">
                        📊 ANALYTICS
                      </button>
                      <button @click="editHackathon(h)" class="px-2.5 py-1 bg-cyber-secondary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary uppercase">
                        ✏️ EDIT
                      </button>
                      <button @click="deleteHackathonPrompt(h)" class="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold font-mono rounded hover:bg-red-700 transition uppercase">
                        🗑️ DELETE
                      </button>
                    </td>
                  </tr>
                  <tr v-if="hackathons.length === 0">
                    <td colspan="7" class="text-center py-6 text-slate-500">No active hackathon schedules stored. Create new above.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SECTION D: SECURITY LOGS -->
        <section v-if="activeSection === 'logs'" class="space-y-6 animate-fade-in">
          <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
            <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// PLATFORM AUDIT & SECURITY LOGS</h3>
            <div class="overflow-y-auto max-h-[500px] space-y-2 pr-2 text-xs font-mono">
              <div v-for="log in logs" :key="log._id" class="p-3 rounded bg-[#131C35] border-l-2 flex justify-between items-center shadow"
                :class="log.status === 'success' ? 'border-cyber-primary' : 'border-cyber-danger'"
              >
                <div>
                  <span class="text-slate-500">[{{ new Date(log.createdAt).toLocaleTimeString() }}]</span>
                  <span class="font-bold text-white ml-2">{{ log.action }}</span>
                  <span class="text-slate-300 ml-2">Operator: {{ log.userId?.username || 'System' }}</span>
                  <span class="text-slate-400 ml-2">- {{ JSON.stringify(log.details) }}</span>
                </div>
                <div class="text-[10px] text-slate-500">IP: {{ log.ipAddress }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION E: SETTINGS CONSOLE -->
        <section v-if="activeSection === 'settings'" class="space-y-6 animate-fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- User Role Manager -->
            <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
              <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Security & Role Assignment</h3>
              <p class="text-xs text-slate-400">Modify operations clearance levels and staff signatures in the centralized database node.</p>
              
              <form @submit.prevent="submitRoleChange" class="space-y-4 font-mono text-xs">
                <div class="space-y-1">
                  <label class="text-[10px] text-slate-500 uppercase block">Target User ID (MongoDB Object ID)</label>
                  <input v-model="roleForm.targetUserId" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary" placeholder="e.g. 6a3ba54a2970eb50fcafc345" required />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-500 uppercase block">Action directive</label>
                    <select v-model="roleForm.action" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary">
                      <option value="add">Grant / Add Role</option>
                      <option value="remove">Revoke / Remove Role</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-500 uppercase block">Role authorization key</label>
                    <select v-model="roleForm.role" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-primary">
                      <option value="admin">Administrator (admin)</option>
                      <option value="staff">Staff Operator (staff)</option>
                      <option value="support">Support Technician (support)</option>
                      <option value="team_leader">Team Leader (team_leader)</option>
                      <option value="team_member">Crew Member (team_member)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" :disabled="roleLoading" class="w-full py-2 bg-cyber-primary text-[#0B1020] text-xs font-bold rounded hover:bg-cyber-primary/90 transition shadow-neon-primary disabled:opacity-50">
                  {{ roleLoading ? 'COMMITTING SECURITY ROLES...' : 'COMMIT ROLE ACCESS CHANGE' }}
                </button>
              </form>
            </div>

            <!-- Platform Rules Engine Simulation -->
            <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
              <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Platform Security Policy</h3>
              <div class="space-y-4 font-mono text-xs">
                <div class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                  <div>
                    <span class="font-bold text-white block">Maintenance Lockout Node</span>
                    <span class="text-[10px] text-slate-500">Blocks non-operator traffic globally when active.</span>
                  </div>
                  <button @click="toggleSimulatedSetting('maintenanceMode')" class="px-3 py-1 rounded text-[10px] font-bold transition"
                    :class="simulatedSettings.maintenanceMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-slate-400 border border-white/10'"
                  >
                    {{ simulatedSettings.maintenanceMode ? 'ACTIVE LOCK' : 'INACTIVE' }}
                  </button>
                </div>

                <div class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                  <div>
                    <span class="font-bold text-white block">Strict Password Validation</span>
                    <span class="text-[10px] text-slate-500">Requires multi-character non-alphanumeric flags.</span>
                  </div>
                  <button @click="toggleSimulatedSetting('strictPasswords')" class="px-3 py-1 rounded text-[10px] font-bold transition"
                    :class="simulatedSettings.strictPasswords ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30 shadow-neon-primary' : 'bg-white/5 text-slate-400 border border-white/10'"
                  >
                    {{ simulatedSettings.strictPasswords ? 'STRICT' : 'STANDARD' }}
                  </button>
                </div>

                <div class="flex justify-between items-center p-3 rounded bg-white/5 border border-white/5">
                  <div>
                    <span class="font-bold text-white block">API Request Rate Limit Threshold</span>
                    <span class="text-[10px] text-slate-500 font-bold text-cyber-secondary">{{ simulatedSettings.rateLimit }} req/sec</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button @click="adjustRateLimit(-5)" class="px-2 py-0.5 bg-white/5 border border-white/10 rounded hover:bg-white/10">-</button>
                    <button @click="adjustRateLimit(5)" class="px-2 py-0.5 bg-white/5 border border-white/10 rounded hover:bg-white/10">+</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Environment Variables Visualizer -->
          <div class="p-6 rounded-lg glass-panel border border-white/5 space-y-4">
            <h3 class="text-sm font-bold font-mono text-white border-b border-white/5 pb-2 uppercase">// Environment Configuration Node</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase">NODE_ENV</span>
                <span class="font-bold text-cyber-secondary">development</span>
              </div>
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase">PORT CONFIG</span>
                <span class="font-bold text-cyber-secondary">5001</span>
              </div>
              <div class="p-3 rounded bg-[#131C35] space-y-1">
                <span class="text-[10px] text-slate-500 block uppercase">PLATFORM RUNTIME</span>
                <span class="font-bold text-cyber-secondary">Vite + Node Express</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- 3. CHALLENGE CREATION / EDITING MODAL -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div class="relative w-full max-w-4xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel">
        <div class="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 class="text-lg font-bold font-mono text-cyber-primary">
            {{ isEditing ? '// EDIT CTF CHALLENGE UNIT' : '// DEPLOY NEW CTF CHALLENGE UNIT' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-white text-lg font-mono">×</button>
        </div>

        <form @submit.prevent="submitChallenge" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Challenge Title</label>
              <input v-model="form.title" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="e.g. SQL Injection Injection" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Category</label>
              <select v-model="form.category" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200">
                <option value="Web">Web Exploitation</option>
                <option value="Scripting">Scripting</option>
                <option value="Networking">Networking</option>
                <option value="System">System Hardening</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Difficulty</label>
              <select v-model="form.difficulty" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Stars (Rating)</label>
              <select v-model.number="form.stars" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200">
                <option :value="1">1 Star</option>
                <option :value="2">2 Stars</option>
                <option :value="3">3 Stars</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Timer (Minutes)</label>
              <input v-model.number="form.timerMinutes" type="number" min="1" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Challenge Image</label>
              <div
                @dragover.prevent="dragOverImage = true"
                @dragleave.prevent="dragOverImage = false"
                @drop.prevent="onChallengeImageDrop"
                @click="challengeImageInput.click()"
                class="w-full h-24 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden group"
                :class="dragOverImage ? 'border-cyber-primary bg-cyber-primary/5' : 'border-white/10 bg-[#0B1020]/50 hover:border-cyber-primary/55'"
              >
                <input type="file" ref="challengeImageInput" @change="onChallengeImageUpload" accept="image/*" class="hidden" />
                
                <div v-if="form.image" class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span class="text-[10px] font-mono text-cyber-primary font-bold">CLICK OR DROP TO CHANGE</span>
                </div>
                
                <img v-if="form.image" :src="form.image.startsWith('http') ? form.image : (form.image.startsWith('/') ? form.image : '/' + form.image)" class="w-full h-full object-cover" />
                <div v-else class="text-center font-mono text-[10px] text-slate-500 p-2">
                  <span class="text-2xl block mb-1">🖼️</span>
                  <span>DRAG & DROP IMAGE OR CLICK</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500">Short Description (Max 250 characters)</label>
            <input v-model="form.shortDescription" type="text" maxlength="250" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="A brief security node breakdown..." required />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500">Long Description (TipTap Editor)</label>
            <div class="border border-white/10 rounded bg-[#131C35] overflow-hidden">
              <div class="bg-white/5 border-b border-white/10 p-2 flex space-x-2 text-xs font-mono">
                <button type="button" @click="editor?.chain().focus().toggleBold().run()" class="px-2 py-0.5 rounded hover:bg-white/10" :class="{ 'bg-white/15': editor?.isActive('bold') }">B</button>
                <button type="button" @click="editor?.chain().focus().toggleItalic().run()" class="px-2 py-0.5 rounded hover:bg-white/10" :class="{ 'bg-white/15': editor?.isActive('italic') }">I</button>
                <button type="button" @click="editor?.chain().focus().toggleCode().run()" class="px-2 py-0.5 rounded hover:bg-white/10" :class="{ 'bg-white/15': editor?.isActive('code') }">Code</button>
              </div>
              <editor-content :editor="editor" class="p-3 text-xs min-h-[100px] text-slate-300 focus:outline-none" />
            </div>
          </div>

          <!-- Challenge Flags Section -->
          <div class="border-t border-white/10 pt-4 space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="text-xs uppercase font-mono font-bold tracking-widest text-cyber-secondary">
                // Challenge Flags ({{ form.flags.length }} / 3)
              </h4>
              <button type="button" @click="addFlagNode" class="px-2 py-1 bg-cyber-secondary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary">
                + ADD FLAG
              </button>
            </div>

            <div class="space-y-2">
              <div v-for="(flag, fIndex) in form.flags" :key="fIndex" class="flex items-center space-x-2">
                <span class="text-[10px] font-mono text-slate-500 min-w-[50px]">Flag #{{ fIndex + 1 }}</span>
                <input v-model="form.flags[fIndex]" type="text" class="flex-1 bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="FLAG{cyber_sec_flag_value}" required />
                <button v-if="form.flags.length > 1" type="button" @click="removeFlagNode(fIndex)" class="px-2.5 py-1 text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded font-mono text-[10px] font-bold uppercase transition">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Dynamic Questions Management -->
          <div class="border-t border-white/10 pt-4 space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="text-xs uppercase font-mono font-bold tracking-widest text-cyber-secondary">
                // Question Nodes ({{ form.questions.length }} / 10)
              </h4>
              <button type="button" @click="addQuestionNode" class="px-2 py-1 bg-cyber-secondary text-[#0B1020] text-[10px] font-bold font-mono rounded hover:bg-cyber-secondary/90 transition shadow-neon-secondary">
                + ADD QUESTION
              </button>
            </div>
            
            <p v-if="form.questions.length < 5 || form.questions.length > 10" class="text-[10px] font-mono text-cyber-danger uppercase">
              ⚠️ Validation Alert: A challenge must contain between 5 and 10 questions.
            </p>

            <div class="space-y-4">
              <div v-for="(q, qIndex) in form.questions" :key="qIndex" class="p-4 rounded border border-white/5 bg-[#131C35]/50 space-y-3 relative">
                <button type="button" @click="removeQuestionNode(qIndex)" class="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-mono text-[10px] uppercase border border-white/10 px-2 py-0.5 rounded bg-white/5">
                  Remove
                </button>

                <span class="text-[10px] font-mono text-cyber-accent block">QUESTION #{{ qIndex + 1 }}</span>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Question Title</label>
                    <input v-model="q.title" type="text" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="e.g. Find Admin Cookie" required />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Points</label>
                    <input v-model.number="q.points" type="number" min="10" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Question Description</label>
                    <input v-model="q.description" type="text" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="Instructions for users..." required />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Input Type</label>
                    <select v-model="q.type" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200">
                      <option value="text">Text (Flag)</option>
                      <option value="url">URL Target</option>
                      <option value="image">Image Attachment</option>
                      <option value="video">Video Resource</option>
                      <option value="audio">Audio Resource</option>
                      <option value="file">File Resource</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Answer</label>
                    <input v-model="q.answer" type="text" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="Plaintext answer to verify..." required />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] uppercase font-mono text-slate-500">Hint (Optional)</label>
                    <input v-model="q.hint" type="text" class="w-full bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="Hint detail..." />
                  </div>
                </div>

                <!-- Attachment file upload hook -->
                <div class="space-y-1 pt-1">
                  <label class="text-[9px] uppercase font-mono text-slate-500">Question Attachment File</label>
                  <div class="flex items-center gap-2">
                    <input type="file" @change="onQuestionAttachmentUpload($event, qIndex)" class="hidden" :ref="el => { if(el) questionFileInputRefs[qIndex] = el }" />
                    <button type="button" @click="questionFileInputRefs[qIndex]?.click()" class="px-2.5 py-1 bg-[#0B1020] border border-white/10 rounded text-[9px] uppercase text-slate-300 font-mono">
                      Upload Resource File
                    </button>
                    <span class="text-[9px] text-slate-500 truncate max-w-[200px]" v-if="q.attachmentsString">
                      {{ q.attachmentsString.split('/').pop() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10">
              CANCEL
            </button>
            <button type="submit" class="px-6 py-2 bg-cyber-primary text-[#0B1020] font-mono text-xs font-bold rounded hover:bg-cyber-primary/90">
              {{ isEditing ? 'UPDATE CHALLENGE' : 'DEPLOY CHALLENGE' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 4. HACKATHON CREATION MODAL -->
    <div v-if="showHackathonModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div class="relative w-full max-w-2xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel">
        <div class="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 class="text-lg font-bold font-mono text-cyber-secondary">
            {{ editingHackathonId ? '// EDIT HACKATHON ARENA' : '// DEPLOY NEW HACKATHON ARENA' }}
          </h3>
          <button @click="closeHackathonModal" class="text-slate-400 hover:text-white text-lg font-mono">×</button>
        </div>

        <form @submit.prevent="submitHackathon" class="space-y-4 text-xs font-mono">
          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500">Hackathon Name</label>
            <input v-model="hackathonForm.name" type="text" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="e.g. Cyber Security Summit 2026" required />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-500">Arena Description</label>
            <textarea v-model="hackathonForm.description" rows="3" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" placeholder="Description of rules, timing, rewards..." required></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Registration Start Date</label>
              <input v-model="hackathonForm.registrationStart" type="datetime-local" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Registration End Date</label>
              <input v-model="hackathonForm.registrationEnd" type="datetime-local" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Hackathon Run Start Date</label>
              <input v-model="hackathonForm.hackathonStart" type="datetime-local" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Hackathon Run End Date</label>
              <input v-model="hackathonForm.hackathonEnd" type="datetime-local" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Maximum Teams Allowed</label>
              <input v-model.number="hackathonForm.maxTeams" type="number" min="2" max="1000" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200" required />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Cover Banner/Image</label>
              <div class="flex items-center gap-3">
                <input type="file" @change="onHackathonCoverUpload" accept="image/*" class="hidden" ref="hackathonCoverInput" />
                <button type="button" @click="hackathonCoverInput?.click()" class="px-3 py-1.5 bg-[#131C35] border border-white/10 rounded text-[10px] uppercase text-slate-300 font-mono">
                  Upload Cover Image File
                </button>
                <span class="text-[10px] text-slate-500 truncate max-w-[200px]" v-if="hackathonForm.coverImage">
                  {{ hackathonForm.coverImage.split('/').pop() }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="editingHackathonId" class="grid grid-cols-1 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-mono text-slate-500">Hackathon Status</label>
              <select v-model="hackathonForm.status" class="w-full bg-[#131C35] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyber-primary text-slate-200">
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <!-- Select Challenges Checklist -->
          <div class="space-y-2">
            <label class="text-[10px] uppercase font-mono text-slate-500 block">Select challenges to bind to this Hackathon</label>
            <div class="max-h-[150px] overflow-y-auto border border-white/10 rounded p-3 bg-[#131C35]/50 space-y-2">
              <div v-for="c in challenges" :key="c._id" class="flex items-center space-x-2">
                <input type="checkbox" :id="c._id" :value="c._id" v-model="hackathonForm.challenges" class="rounded bg-[#0B1020] border-white/10 text-cyber-secondary focus:ring-cyber-secondary" />
                <label :for="c._id" class="text-xs text-slate-300 cursor-pointer">
                  {{ c.title }} ({{ c.category }} - {{ c.difficulty }})
                </label>
              </div>
              <div v-if="challenges.length === 0" class="text-center py-2 text-slate-500 text-[10px]">
                No challenges available to bind.
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <button type="button" @click="closeHackathonModal" class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10">
              CANCEL
            </button>
            <button type="submit" :disabled="hackathonLoading" class="px-6 py-2 bg-cyber-secondary text-[#0B1020] font-mono text-xs font-bold rounded hover:bg-cyber-secondary/90 disabled:opacity-50">
              {{ hackathonLoading ? (editingHackathonId ? 'UPDATING ARENA...' : 'DEPLOYING ARENA...') : (editingHackathonId ? 'UPDATE HACKATHON' : 'DEPLOY HACKATHON') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 5. HACKATHON ANALYTICS MONITOR MODAL -->
    <div v-if="showStatsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div class="relative w-full max-w-4xl bg-[#0B1020] border border-white/10 rounded-lg p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto glass-panel">
        <div class="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 class="text-lg font-bold font-mono text-cyber-primary uppercase">
              // HACKATHON ANALYTICS MONITOR
            </h3>
            <p class="text-[10px] font-mono text-slate-400 mt-1 uppercase" v-if="selectedHackathonStats?.hackathon">
              Arena: {{ selectedHackathonStats.hackathon.name }} | Status: {{ selectedHackathonStats.hackathon.status }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="refreshHackathonStats" class="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono rounded text-slate-300 transition uppercase">
              🔄 Refresh
            </button>
            <button @click="showStatsModal = false" class="text-slate-400 hover:text-white text-lg font-mono">×</button>
          </div>
        </div>

        <div v-if="selectedHackathonStats" class="space-y-6 font-mono text-xs">
          
          <!-- 1. Leaderboard Standings -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Teams Standings</h4>
            <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30">
              <table class="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                    <th class="py-2.5 px-4">Rank</th>
                    <th class="py-2.5 px-4">Team Name</th>
                    <th class="py-2.5 px-4">Solves</th>
                    <th class="py-2.5 px-4">Score</th>
                    <th class="py-2.5 px-4">Completion %</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="team in selectedHackathonStats.leaderboard" :key="team._id" class="hover:bg-white/5 transition">
                    <td class="py-2.5 px-4 font-bold text-white">#{{ team.rank }}</td>
                    <td class="py-2.5 px-4 text-cyber-secondary font-bold">{{ team.teamName }}</td>
                    <td class="py-2.5 px-4 text-slate-300">{{ team.solved }} Solves</td>
                    <td class="py-2.5 px-4 text-cyber-primary font-bold">{{ team.points }} Points</td>
                    <td class="py-2.5 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-16 bg-white/10 h-2 rounded overflow-hidden">
                          <div class="bg-cyber-primary h-full" :style="{ width: Math.min(100, team.completionPercentage) + '%' }"></div>
                        </div>
                        <span>{{ Math.round(team.completionPercentage) }}%</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedHackathonStats.leaderboard.length === 0">
                    <td colspan="5" class="text-center py-4 text-slate-500">No score points recorded yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2. Active Workspaces -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Active Workspaces (Current Timers)</h4>
            <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30">
              <table class="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                    <th class="py-2.5 px-4">Team Name</th>
                    <th class="py-2.5 px-4">Active Challenge</th>
                    <th class="py-2.5 px-4">Timer Started</th>
                    <th class="py-2.5 px-4">Time Remaining</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="(session, sIndex) in selectedHackathonStats.activeSessions" :key="sIndex" class="hover:bg-white/5 transition">
                    <td class="py-2.5 px-4 font-bold text-white">{{ session.teamName }}</td>
                    <td class="py-2.5 px-4 text-cyber-secondary font-bold">{{ session.challengeTitle }}</td>
                    <td class="py-2.5 px-4 text-slate-400">{{ new Date(session.openedAt).toLocaleTimeString() }}</td>
                    <td class="py-2.5 px-4 text-cyber-danger font-bold">
                      {{ formatTimeRemaining(session.timeRemainingSeconds) }}
                    </td>
                  </tr>
                  <tr v-if="selectedHackathonStats.activeSessions.length === 0">
                    <td colspan="4" class="text-center py-4 text-slate-500">No active sessions or timers right now.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3. Solve Activity Feed -->
          <div class="space-y-2">
            <h4 class="text-xs uppercase font-bold text-cyber-secondary tracking-widest">// Real-Time Solves Feed</h4>
            <div class="overflow-x-auto border border-white/5 rounded bg-[#131C35]/30">
              <table class="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr class="border-b border-white/10 text-slate-400 bg-white/5">
                    <th class="py-2.5 px-4">Player</th>
                    <th class="py-2.5 px-4">Team</th>
                    <th class="py-2.5 px-4">Challenge</th>
                    <th class="py-2.5 px-4">Question Node</th>
                    <th class="py-2.5 px-4">Score Awarded</th>
                    <th class="py-2.5 px-4">Time Solved</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="solve in selectedHackathonStats.userSolves" :key="solve._id" class="hover:bg-white/5 transition border-l-2 border-cyber-primary">
                    <td class="py-2.5 px-4 font-bold text-white">{{ solve.username }}</td>
                    <td class="py-2.5 px-4 text-slate-300">{{ solve.teamName }}</td>
                    <td class="py-2.5 px-4 text-cyber-secondary font-bold">{{ solve.challengeTitle }}</td>
                    <td class="py-2.5 px-4 text-slate-400">{{ solve.questionTitle }}</td>
                    <td class="py-2.5 px-4 text-cyber-primary font-bold">+{{ solve.points }} Pts</td>
                    <td class="py-2.5 px-4 text-slate-500">{{ new Date(solve.timestamp).toLocaleString() }}</td>
                  </tr>
                  <tr v-if="selectedHackathonStats.userSolves.length === 0">
                    <td colspan="6" class="text-center py-4 text-slate-500">No solves submitted yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
        <div v-else class="py-12 flex justify-center items-center text-slate-400 font-mono text-xs">
          🔄 Connecting to server and downloading logs...
        </div>

        <div class="flex justify-end border-t border-white/10 pt-4">
          <button @click="showStatsModal = false" class="px-4 py-2 bg-white/5 text-slate-300 font-mono text-xs rounded hover:bg-white/10">
            CLOSE MONITOR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from 'vue-toastification';
import VueApexCharts from 'vue3-apexcharts';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import api from '../utils/api.js';

const toast = useToast();
const apexchart = VueApexCharts;

// Sidebar navigation control variable
const activeSection = ref('dashboard');

const dragOverImage = ref(false);
const challengeImageInput = ref(null);

// 1. AUTHENTICATION & LOGIN LOGIC
const isAuthenticated = ref(!!localStorage.getItem('adminToken'));
const adminUser = ref(JSON.parse(localStorage.getItem('adminUser') || 'null'));
const loginLoading = ref(false);
const loginForm = ref({ usernameOrEmail: '', password: '' });

const handleLogin = async () => {
  loginLoading.value = true;
  try {
    const res = await api.post('/auth/login', {
      usernameOrEmail: loginForm.value.usernameOrEmail,
      password: loginForm.value.password,
      deviceName: 'Admin Dashboard Client'
    });
    
    const { accessToken, user } = res.data.data;
    if (!user.roles.includes('admin') && !user.roles.includes('staff')) {
      toast.error('Access Denied: Operators require Admin/Staff signature key.');
      return;
    }

    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('adminUser', JSON.stringify(user));
    adminUser.value = user;
    isAuthenticated.value = true;
    toast.success(`Secure link established. Welcome, ${user.username}!`);
    loadAllData();
  } catch (error) {
    const errorMsg = error?.error?.message || 'Invalid validation credentials';
    toast.error(errorMsg);
  } finally {
    loginLoading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  adminUser.value = null;
  isAuthenticated.value = false;
  toast.info('Secure link terminated.');
};

// 2. DASHBOARD DATA STATES
const stats = ref({ users: 0, teams: 0, ctfs: 0, hackathons: 0 });
const challenges = ref([]);
const hackathons = ref([]);
const logs = ref([]);

// Line Chart: registrations velocity
const velocityChartSeries = ref([{ name: 'Registrations', data: [] }]);
const velocityChartOptions = ref({
  chart: { toolbar: { show: false } },
  colors: ['#7C3AED'],
  xaxis: {
    categories: [],
    labels: { style: { colors: '#64748B' } }
  },
  stroke: { curve: 'smooth', width: 3 },
  theme: { mode: 'dark' }
});

// Bar Chart: challenges by category
const categoryChartSeries = ref([{ name: 'Challenges', data: [] }]);
const categoryChartOptions = ref({
  chart: { toolbar: { show: false } },
  colors: ['#00D4FF'],
  xaxis: {
    categories: [],
    labels: { style: { colors: '#64748B' } }
  },
  theme: { mode: 'dark' }
});

const loadAllData = async () => {
  if (!isAuthenticated.value) return;
  try {
    await Promise.all([
      loadStats(),
      loadChallenges(),
      loadHackathons(),
      loadAuditLogs()
    ]);
  } catch (error) {
    console.error('Failed to load initial metrics', error);
  }
};

const loadStats = async () => {
  try {
    const res = await api.get('/admin/stats');
    const { counts, registrationVelocity, categoryStats } = res.data.data;
    
    stats.value = {
      users: counts.users || 0,
      teams: counts.teams || 0,
      ctfs: counts.ctfs || 0,
      hackathons: counts.hackathons || 0
    };

    if (registrationVelocity && registrationVelocity.length > 0) {
      velocityChartSeries.value = [{
        name: 'Registrations',
        data: registrationVelocity.map(v => v.count)
      }];
      velocityChartOptions.value = {
        ...velocityChartOptions.value,
        xaxis: {
          categories: registrationVelocity.map(v => v._id),
          labels: { style: { colors: '#64748B' } }
        }
      };
    }

    if (categoryStats && categoryStats.length > 0) {
      categoryChartSeries.value = [{
        name: 'Challenges',
        data: categoryStats.map(c => c.count)
      }];
      categoryChartOptions.value = {
        ...categoryChartOptions.value,
        xaxis: {
          categories: categoryStats.map(c => c._id),
          labels: { style: { colors: '#64748B' } }
        }
      };
    }
  } catch (err) {
    toast.error('Failed to resolve system stats.');
  }
};

const loadChallenges = async () => {
  try {
    const res = await api.get('/ctfs');
    challenges.value = res.data.data;
  } catch (err) {
    toast.error('Failed to fetch challenges.');
  }
};

const loadHackathons = async () => {
  try {
    const res = await api.get('/hackathons');
    hackathons.value = res.data.data;
  } catch (err) {
    toast.error('Failed to fetch hackathons list.');
  }
};

const loadAuditLogs = async () => {
  try {
    const res = await api.get('/admin/logs');
    logs.value = res.data.data;
  } catch (err) {
    toast.error('Failed to fetch audit logs.');
  }
};

// Association classes and texts
const getChallengeAssociation = (challengeId) => {
  const match = hackathons.value.find(h => h.challenges && h.challenges.includes(challengeId));
  return match ? `Arena: ${match.name}` : 'Permanent';
};

const getAssociationClass = (challengeId) => {
  const match = hackathons.value.find(h => h.challenges && h.challenges.includes(challengeId));
  return match ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30' : 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30';
};

const getDifficultyClass = (difficulty) => {
  if (difficulty === 'easy') return 'bg-green-500/20 text-green-400';
  if (difficulty === 'medium') return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
};

const getHackathonStatusClass = (status) => {
  if (status === 'active') return 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30';
  if (status === 'upcoming') return 'bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/30';
  return 'bg-slate-700/20 text-slate-400 border border-slate-700';
};

const handleStatusChange = async (challengeId, newStatus) => {
  try {
    await api.put(`/ctfs/${challengeId}/status`, { status: newStatus });
    toast.success(`Challenge status changed to ${newStatus}`);
    loadChallenges();
    loadStats();
  } catch (err) {
    toast.error(err?.error?.message || 'Status transition failed.');
  }
};

const handleDelete = async (challengeId) => {
  if (!confirm('Are you sure you want to terminate this challenge node?')) return;
  try {
    await api.delete(`/ctfs/${challengeId}`);
    toast.success('Challenge node successfully deleted.');
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || 'Failed to delete challenge.');
  }
};

// 3. CREATE & EDIT CTF MODAL SYSTEM
const showModal = ref(false);
const isEditing = ref(false);
const editingChallengeId = ref(null);
const editor = ref(null);
const questionFileInputRefs = ref([]);

const form = ref({
  title: '',
  shortDescription: '',
  category: 'Web',
  difficulty: 'easy',
  stars: 1,
  timerMinutes: 60,
  image: '',
  flags: [''],
  questions: []
});

const openCreateModal = () => {
  isEditing.value = false;
  editingChallengeId.value = null;
  form.value = {
    title: '',
    shortDescription: '',
    category: 'Web',
    difficulty: 'easy',
    stars: 1,
    timerMinutes: 60,
    image: '',
    flags: [''],
    questions: []
  };
  
  for (let i = 0; i < 5; i++) {
    addQuestionNode();
  }

  showModal.value = true;
  initEditor('');
};

const openEditModal = (ctf) => {
  isEditing.value = true;
  editingChallengeId.value = ctf._id;

  const mappedQuestions = (ctf.questions || []).map(q => ({
    title: q.title,
    description: q.description,
    points: q.points || q.score || 100,
    type: q.type || 'text',
    answer: q.answer || '',
    hint: q.hint || '',
    attachmentsString: q.attachments && q.attachments.length > 0 ? q.attachments[0] : ''
  }));

  form.value = {
    title: ctf.title,
    shortDescription: ctf.shortDescription,
    category: ctf.category,
    difficulty: ctf.difficulty,
    stars: ctf.stars,
    timerMinutes: ctf.timerMinutes || 60,
    image: ctf.image || '',
    flags: ctf.flags && ctf.flags.length > 0 ? [...ctf.flags] : [''],
    questions: mappedQuestions
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
      content: content || '<p>Detailed challenge walkthrough and instructions...</p>',
      extensions: [StarterKit],
    });
  }, 100);
};

const destroyEditor = () => {
  editor.value?.destroy();
  editor.value = null;
};

const addQuestionNode = () => {
  if (form.value.questions.length >= 10) {
    toast.warning('Maximum 10 questions permitted per challenge.');
    return;
  }
  form.value.questions.push({
    title: '',
    description: '',
    points: 100,
    type: 'text',
    answer: '',
    hint: '',
    attachmentsString: ''
  });
};

const removeQuestionNode = (index) => {
  form.value.questions.splice(index, 1);
};

const addFlagNode = () => {
  if (form.value.flags.length >= 3) {
    toast.warning('Maximum 3 flags permitted per challenge.');
    return;
  }
  form.value.flags.push('');
};

const removeFlagNode = (index) => {
  if (form.value.flags.length <= 1) {
    toast.warning('At least 1 flag is required.');
    return;
  }
  form.value.flags.splice(index, 1);
};

// Upload question resource attachment
const onQuestionAttachmentUpload = async (event, qIndex) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    toast.info('Uploading resource file...');
    const res = await api.post('/ctfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    form.value.questions[qIndex].attachmentsString = res.data.data.url;
    toast.success('Resource file uploaded successfully!');
  } catch (error) {
    toast.error(error?.error?.message || 'Resource upload failed');
  }
};

const submitChallenge = async () => {
  if (form.value.questions.length < 5 || form.value.questions.length > 10) {
    toast.error('Validation Error: A challenge must contain between 5 and 10 questions.');
    return;
  }

  if (form.value.flags.length < 1 || form.value.flags.length > 3) {
    toast.error('Validation Error: A challenge must contain between 1 and 3 flags.');
    return;
  }

  if (form.value.flags.some(f => !f.trim())) {
    toast.error('Validation Error: Flags cannot be empty.');
    return;
  }

  const longDescriptionHtml = editor.value?.getHTML() || '';
  
  const formattedQuestions = form.value.questions.map(q => {
    return {
      title: q.title,
      description: q.description,
      points: q.points,
      attachments: q.attachmentsString ? [q.attachmentsString] : [],
      answer: q.answer,
      hint: q.hint || '',
      type: q.type || 'text'
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
    flags: form.value.flags.map(f => f.trim()),
    questions: formattedQuestions
  };

  try {
    if (isEditing.value) {
      await api.put(`/ctfs/${editingChallengeId.value}`, payload);
      toast.success('Challenge updated successfully!');
    } else {
      await api.post('/ctfs', payload);
      toast.success('Challenge deployed successfully in draft mode.');
    }
    
    closeModal();
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || 'Deployment validation failed.');
  }
};

// 4. HACKATHON MODAL MANAGEMENT
const showHackathonModal = ref(false);
const editingHackathonId = ref('');
const hackathonLoading = ref(false);
const hackathonCoverInput = ref(null);
const hackathonForm = ref({
  name: '',
  description: '',
  registrationStart: '',
  registrationEnd: '',
  hackathonStart: '',
  hackathonEnd: '',
  maxTeams: 50,
  coverImage: '',
  challenges: [],
  status: 'upcoming'
});

const openHackathonModal = () => {
  editingHackathonId.value = '';
  hackathonForm.value = {
    name: '',
    description: '',
    registrationStart: '',
    registrationEnd: '',
    hackathonStart: '',
    hackathonEnd: '',
    maxTeams: 50,
    coverImage: '',
    challenges: [],
    status: 'upcoming'
  };
  showHackathonModal.value = true;
};

const closeHackathonModal = () => {
  showHackathonModal.value = false;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const editHackathon = (h) => {
  editingHackathonId.value = h._id;
  hackathonForm.value = {
    name: h.name,
    description: h.description,
    registrationStart: formatDateForInput(h.registrationStart),
    registrationEnd: formatDateForInput(h.registrationEnd),
    hackathonStart: formatDateForInput(h.hackathonStart),
    hackathonEnd: formatDateForInput(h.hackathonEnd),
    maxTeams: h.maxTeams,
    coverImage: h.coverImage || '',
    challenges: h.challenges || [],
    status: h.status || 'upcoming'
  };
  showHackathonModal.value = true;
};

const deleteHackathonPrompt = async (h) => {
  const confirmDelete = confirm(`Are you sure you want to permanently delete hackathon "${h.name}"? This will clear all news reports and team logs bound to it.`);
  if (!confirmDelete) return;

  try {
    toast.info('Decomposing hackathon registry...');
    await api.delete(`/admin/hackathons/${h._id}`);
    toast.success('Hackathon completely deleted.');
    loadHackathons();
    loadStats();
    loadAuditLogs();
  } catch (err) {
    toast.error(err?.error?.message || 'Decomposition script error.');
  }
};

// Hackathon analytics monitor logic
const showStatsModal = ref(false);
const selectedHackathonStats = ref(null);
const currentHackathonId = ref('');

const openHackathonAnalytics = async (hackathonId) => {
  currentHackathonId.value = hackathonId;
  selectedHackathonStats.value = null;
  showStatsModal.value = true;
  await fetchAnalyticsData(hackathonId);
};

const fetchAnalyticsData = async (hackathonId) => {
  try {
    const res = await api.get(`/admin/hackathons/${hackathonId}/stats`);
    selectedHackathonStats.value = res.data.data;
  } catch (err) {
    toast.error(err?.error?.message || 'Failed to download hackathon analytics data.');
    showStatsModal.value = false;
  }
};

const refreshHackathonStats = async () => {
  if (currentHackathonId.value) {
    await fetchAnalyticsData(currentHackathonId.value);
    toast.success('Analytics logs successfully refreshed.');
  }
};

const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) return 'Expired';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
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
  formData.append('file', file);

  try {
    toast.info('Uploading banner image...');
    const res = await api.post('/ctfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    hackathonForm.value.coverImage = res.data.data.url;
    toast.success('Banner uploaded successfully!');
  } catch (error) {
    toast.error(error?.error?.message || 'Banner upload failed');
  }
};

// Upload Challenge Image via drag-and-drop or click selector
const uploadChallengeImageFile = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    toast.info('Uploading challenge image...');
    const res = await api.post('/ctfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    form.value.image = res.data.data.url;
    toast.success('Image uploaded successfully!');
  } catch (error) {
    toast.error(error?.error?.message || 'Image upload failed');
  }
};

const onChallengeImageUpload = (event) => {
  const file = event.target.files[0];
  uploadChallengeImageFile(file);
};

const onChallengeImageDrop = (event) => {
  dragOverImage.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadChallengeImageFile(file);
  } else {
    toast.error('Only image files are allowed');
  }
};

const submitHackathon = async () => {
  hackathonLoading.value = true;
  try {
    const payload = {
      name: hackathonForm.value.name,
      description: hackathonForm.value.description,
      registrationStart: new Date(hackathonForm.value.registrationStart).toISOString(),
      registrationEnd: new Date(hackathonForm.value.registrationEnd).toISOString(),
      hackathonStart: new Date(hackathonForm.value.hackathonStart).toISOString(),
      hackathonEnd: new Date(hackathonForm.value.hackathonEnd).toISOString(),
      maxTeams: hackathonForm.value.maxTeams,
      coverImage: hackathonForm.value.coverImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
      banner: hackathonForm.value.coverImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
      challenges: hackathonForm.value.challenges
    };

    if (editingHackathonId.value) {
      payload.status = hackathonForm.value.status;
      await api.put(`/admin/hackathons/${editingHackathonId.value}`, payload);
      toast.success('Hackathon arena successfully updated!');
    } else {
      await api.post('/admin/hackathons', payload);
      toast.success('New hackathon arena successfully deployed!');
    }
    closeHackathonModal();
    loadHackathons();
    loadChallenges();
    loadStats();
    loadAuditLogs();
  } catch (error) {
    const errorMsg = error?.error?.message || 'Failed to submit hackathon configuration.';
    toast.error(errorMsg);
  } finally {
    hackathonLoading.value = false;
  }
};

// 5. SETTINGS FORM OPERATIONS
const roleForm = ref({ targetUserId: '', action: 'add', role: 'staff' });
const roleLoading = ref(false);

const submitRoleChange = async () => {
  roleLoading.value = true;
  try {
    const res = await api.post('/admin/roles', roleForm.value);
    toast.success(res.data.message);
    roleForm.value.targetUserId = '';
    loadAuditLogs();
    loadStats();
  } catch (error) {
    toast.error(error?.error?.message || 'Role change submission failed.');
  } finally {
    roleLoading.value = false;
  }
};

// Simulated platform settings stored in localStorage
const simulatedSettings = ref({
  maintenanceMode: localStorage.getItem('cfg_maintenance') === 'true',
  strictPasswords: localStorage.getItem('cfg_strict_pass') === 'true',
  rateLimit: parseInt(localStorage.getItem('cfg_rate_limit') || '30')
});

const toggleSimulatedSetting = (key) => {
  simulatedSettings.value[key] = !simulatedSettings.value[key];
  localStorage.setItem(`cfg_${key === 'maintenanceMode' ? 'maintenance' : 'strict_pass'}`, simulatedSettings.value[key]);
  toast.success(`Platform setting ${key} successfully toggled.`);
};

const adjustRateLimit = (delta) => {
  simulatedSettings.value.rateLimit = Math.max(5, Math.min(200, simulatedSettings.value.rateLimit + delta));
  localStorage.setItem('cfg_rate_limit', simulatedSettings.value.rateLimit);
};

onMounted(() => {
  loadAllData();
});

onBeforeUnmount(() => {
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
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
