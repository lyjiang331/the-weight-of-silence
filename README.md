# The Weight of Silence

**The Weight of Silence** is an interactive website created for the class project *Feeling Through Function*. It explores how an unanswered message can feel different depending on the conversation, the amount of time that has passed, and the meaning a visitor assigns to the silence.

## How to use it

1. Choose a conversation scenario.
2. Move the time slider to change how long the message has been unanswered.
3. Select what you think the silence means.
4. Notice how the sender's emotional state and inner monologue change.
5. Select **Reveal the Other Side** to see the recipient type, reply, and explain what was actually happening.

## State and combined-input logic

The main visitor-controlled state variables are:

- `currentScenario`: the selected conversation (`lunch`, `personal`, or `tonight`).
- `waitingTime`: the slider value from 0 to 120 minutes.
- `interpretation`: the visitor's guess (`busy`, `avoiding`, or `unsure`).

The program combines `currentScenario` and `waitingTime` to calculate `emotionalState` as `Calm`, `Uneasy`, or `Overthinking`. Each scenario has different time thresholds. The `interpretation` then changes the wording of the inner monologue without automatically forcing a more anxious state.

The reveal uses `revealStage` (`hidden`, `typing`, or `revealed`) and `revealTimerId`. A timed callback creates the typing pause, while `clearTimeout()` prevents an outdated reply from appearing if an input changes.

## Technologies used

- HTML5
- CSS3, including responsive layouts, transitions, and `prefers-reduced-motion`
- Vanilla JavaScript

This project has no backend, build step, database, external API, or API key requirement. Open `index.html` directly or serve the folder with any static web server.

## Development acknowledgment

Codex assisted with development, debugging, visual refinement, and documentation. The project concept, interaction goals, and final decisions were directed and reviewed by the student.
