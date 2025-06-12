# mcp-praxis-live
A frontend with MCP server for Praxis-Live. A work in progress, currently working on the API and connection to the Java backend.

![title](./screenshot.png)
'''
<div class="_MarkdownContent_19116_1"><p>I'll integrate a suitable LLM to power the AI assistant in your frontend. I'll use OpenAI's API as it's widely supported and provides excellent conversational capabilities for multimedia control tasks.</p>
<div class="collapsible flex flex-col border border-bolt-elements-borderColor overflow-hidden rounded-lg w-full transition-border duration-150 artifact" data-artifact-id="20:integrate-llm-frontend"><div class="flex relative flex-row-reverse"><div class="flex text-left items-stretch w-full overflow-hidden bg-bolt-elements-artifacts-background"><div class="p-5 pl-0 grow text-bolt-elements-textPrimary font-medium">Integrate LLM with Frontend AI Assistant</div><div class="flex items-center px-2 bg-bolt-elements-artifacts-background"><button class="flex items-center justify-center shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 text-xs px-2 h-7 focus-visible:outline-bolt-ds-brandHighlight bg-transparent [&amp;:hover:where(:not(:disabled))]:bg-bolt-ds-inverseSurface/10 text-bolt-ds-textPrimary" type="button" data-state="closed"><span class="truncate"><div class="flex flex-row items-center gap-1.5"><div class="i-ph:clock-counter-clockwise text-lg"></div>Undo</div></span></button></div></div><div class="flex-1 flex items-center bg-bolt-elements-artifacts-background px-2"><button class="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1"><div class="i-ph:caret-up text-lg"></div></button></div></div><div style="height: auto; visibility: visible;"><div class="bg-bolt-elements-artifacts-borderColor h-[1px]"></div><div class="actions p-5 text-left bg-bolt-elements-actions-background"><ul class="list-none space-y-2.5"><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Update</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">package.json</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left pointer-events-none pb-1"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Install dependencies</div></button><div class="text-xs border border-bolt-elements-borderColor overflow-hidden rounded-lg w-full mt-1 mb-3.5"><pre class="shiki dark-plus" style="background-color:#1E1E1E;color:#D4D4D4" tabindex="0"><code><span class="line"><span style="color:#DCDCAA">npm</span><span style="color:#CE9178"> install</span></span></code></pre></div></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Create</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">src/services/llmService.ts</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Update</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">src/hooks/useMCPIntegration.ts</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Update</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">src/types/multimedia.ts</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Update</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">src/components/MCPChat.tsx</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Update</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">src/App.tsx</code></span></button></li><li style="opacity: 1; transform: none;"><button class="group select-none flex gap-1.5 text-sm bg-transparent text-left hover:underline"><div class="flex items-center gap-1.5"><div class="text-lg text-bolt-elements-icon-success"><div class="i-ph:check"></div></div>Create</div><span><code class="select-text bg-bolt-elements-artifacts-inlineCode-background px-1.5 py-1 rounded-md break-all text-bolt-elements-artifacts-inlineCode-text">.env.example</code></span></button></li></ul></div></div></div>
<p>I've successfully integrated a powerful LLM (OpenAI's GPT-3.5-turbo) into your frontend AI assistant! Here's what I've added:</p>
<h2>Key Features:</h2>
<h3>🤖 <strong>Intelligent AI Assistant</strong></h3>
<ul>
<li><strong>Natural Language Processing</strong>: Understands commands like "increase volume of track 1 to 80" or "make the video brighter"</li>
<li><strong>Context Awareness</strong>: Knows the current state of all audio/video tracks and nodes</li>
<li><strong>Action Execution</strong>: Automatically applies changes to your multimedia controls</li>
</ul>
<h3>🔧 <strong>Smart Integration</strong></h3>
<ul>
<li><strong>Real-time Control</strong>: AI commands directly update sliders and controls</li>
<li><strong>Multi-modal Support</strong>: Controls audio, video, and Praxis-Live nodes</li>
<li><strong>Action Feedback</strong>: Shows exactly what changes were made</li>
</ul>
<h3>⚙️ <strong>Configuration Options</strong></h3>
<ul>
<li><strong>API Key Management</strong>: Built-in settings to configure your OpenAI API key</li>
<li><strong>Demo Mode</strong>: Works without API key using pattern matching</li>
<li><strong>Secure Storage</strong>: API keys stored locally for convenience</li>
</ul>
<h3>💬 <strong>Enhanced Chat Interface</strong></h3>
<ul>
<li><strong>Visual Feedback</strong>: Shows processing status and action results</li>
<li><strong>Command History</strong>: Keeps track of all interactions</li>
<li><strong>Error Handling</strong>: Graceful fallbacks when API is unavailable</li>
</ul>
<h2>How to Use:</h2>
<ol>
<li><strong>Get an OpenAI API Key</strong>: Visit <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a></li>
<li><strong>Configure the Key</strong>: Click the settings icon in the AI chat and enter your key</li>
<li><strong>Start Chatting</strong>: Try commands like:
<ul>
<li>"Set volume of master audio to 90"</li>
<li>"Increase video brightness by 30"</li>
<li>"Mute all audio tracks"</li>
<li>"Make the video more saturated"</li>
</ul>
</li>
</ol>
<h2>Example Commands:</h2>
<ul>
<li><strong>Audio</strong>: "Turn up track 2", "Mute the master", "Set pan to center"</li>
<li><strong>Video</strong>: "Brighten the main video", "Reduce opacity to 50%", "Increase contrast"</li>
<li><strong>Complex</strong>: "Make track 1 louder and pan it left while brightening the video"</li>
</ul>
<p>The AI assistant now provides intelligent, context-aware control over your entire multimedia system with natural language commands!</p></div>
'''
