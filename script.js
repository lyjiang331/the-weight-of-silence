// STATE VARIABLES
// These three values come directly from the visitor's inputs.
let currentScenario = "lunch";
let waitingTime = 0;
let interpretation = "";

// This value is calculated from the scenario and waiting time.
let emotionalState = "Calm";

// The reveal moves through three stages: hidden, typing, and revealed.
let revealStage = "hidden";
let revealTimerId = null;

// ELEMENT VARIABLES
// These variables connect JavaScript to specific parts of the HTML.
const scenarioSelect = document.querySelector("#scenarioSelect");
const timeSlider = document.querySelector("#timeSlider");
const timeOutput = document.querySelector("#timeOutput");
const contextMessage = document.querySelector("#contextMessage");
const sentMessage = document.querySelector("#sentMessage");
const seenTime = document.querySelector("#seenTime");
const senderThought = document.querySelector("#senderThought");
const feelingLabel = document.querySelector("#feelingLabel");
const emotionalStateLabel = document.querySelector("#emotionalStateLabel");
const thoughtCard = document.querySelector(".thought-card");
const experience = document.querySelector(".experience");
const interpretationChoices = document.querySelectorAll('input[name="interpretation"]');
const revealButton = document.querySelector("#revealButton");
const revealHint = document.querySelector("#revealHint");
const revealArea = document.querySelector("#revealArea");
const typingBubble = document.querySelector("#typingBubble");
const recipientReply = document.querySelector("#recipientReply");
const revealDetails = document.querySelector("#revealDetails");
const actualExplanation = document.querySelector("#actualExplanation");
const reflectionText = document.querySelector("#reflectionText");

// Update the messages so they match the selected scenario.
function updateConversation() {
  if (currentScenario === "lunch") {
    contextMessage.textContent = "Want to grab lunch near campus?";
    sentMessage.textContent = "Yes! Does 12:30 work for you?";
  } else if (currentScenario === "personal") {
    contextMessage.textContent = "You seemed quiet earlier. Are you okay?";
    sentMessage.textContent = "Can we talk later? There's something on my mind.";
  } else {
    contextMessage.textContent = "What are we doing tonight?";
    sentMessage.textContent = "I'm free after 8. Want to make a plan?";
  }
}

// EMOTIONAL-STATE LOGIC
// Each conversation has its own thresholds because the emotional stakes differ.
function determineEmotionalState() {
  if (currentScenario === "lunch") {
    if (waitingTime < 25) {
      return "Calm";
    } else if (waitingTime < 60) {
      return "Uneasy";
    } else {
      return "Overthinking";
    }
  } else if (currentScenario === "personal") {
    if (waitingTime < 5) {
      return "Calm";
    } else if (waitingTime < 20) {
      return "Uneasy";
    } else {
      return "Overthinking";
    }
  } else {
    if (waitingTime < 10) {
      return "Calm";
    } else if (waitingTime < 40) {
      return "Uneasy";
    } else {
      return "Overthinking";
    }
  }
}

// Interpretations change the tone, but do not automatically change the emotional state.
function getInterpretationThought() {
  if (interpretation === "busy") {
    if (emotionalState === "Calm") {
      return "They're probably just busy.";
    } else if (emotionalState === "Uneasy") {
      return "They may still be busy, but I wish they would say so.";
    } else {
      return "I keep telling myself they're busy, but it is getting harder to believe.";
    }
  } else if (interpretation === "avoiding") {
    if (emotionalState === "Calm") {
      return "Part of me wonders if they're avoiding this, but it is too soon to know.";
    } else if (emotionalState === "Uneasy") {
      return "I am starting to read the silence as avoidance.";
    } else {
      return "I cannot stop assuming the silence is deliberate.";
    }
  } else {
    if (emotionalState === "Calm") {
      return "There is not enough information yet.";
    } else if (emotionalState === "Uneasy") {
      return "I keep switching between harmless and hurtful explanations.";
    } else {
      return "Not knowing is making every explanation feel possible.";
    }
  }
}

// Use the scenario and its emotional state to choose the sender's thought.
function updateThought() {
  emotionalState = determineEmotionalState();
  emotionalStateLabel.textContent = emotionalState;
  thoughtCard.dataset.state = emotionalState;
  experience.dataset.state = emotionalState;
  let scenarioThought = "";

  if (currentScenario === "lunch") {
    if (emotionalState === "Calm") {
      scenarioThought = "No rush. Lunch plans do not need an immediate answer.";
      feelingLabel.textContent = "A lunch reply can wait a little while.";
    } else if (emotionalState === "Uneasy") {
      scenarioThought = "Should I check whether 12:30 still works?";
      feelingLabel.textContent = "The practical uncertainty is beginning.";
    } else {
      scenarioThought = "Lunch is getting close, and I still do not have an answer.";
      feelingLabel.textContent = "A small delay is becoming a personal story.";
    }
  } else if (currentScenario === "personal") {
    if (emotionalState === "Calm") {
      scenarioThought = "This message might take a moment to answer.";
      feelingLabel.textContent = "The silence still feels careful.";
    } else if (emotionalState === "Uneasy") {
      scenarioThought = "Did ‘Can we talk later?’ sound worse than I meant?";
      feelingLabel.textContent = "The vulnerability makes a short wait feel longer.";
    } else {
      scenarioThought = "They saw it, and now I am replaying every word.";
      feelingLabel.textContent = "The silence is filling with imagined outcomes.";
    }
  } else {
    if (emotionalState === "Calm") {
      scenarioThought = "There is still time to figure out tonight.";
      feelingLabel.textContent = "There is still plenty of time to decide.";
    } else if (emotionalState === "Uneasy") {
      scenarioThought = "Should I keep my evening open or make another plan?";
      feelingLabel.textContent = "Time pressure is making the silence matter.";
    } else {
      scenarioThought = "The evening is getting closer, and I feel left out of the decision.";
      feelingLabel.textContent = "Uncertainty has turned into a story about exclusion.";
    }
  }

  const interpretationThought = getInterpretationThought();
  senderThought.textContent = `“${scenarioThought} ${interpretationThought}”`;
}

// Choose the ordinary event on Alex's side and compare it with the visitor's guess.
function updateRevealContent() {
  let ordinaryEvent = "";

  if (currentScenario === "lunch") {
    recipientReply.textContent = "Yes—12:30 works! Sorry, I was ordering at the café.";
    ordinaryEvent = "Alex was at the counter ordering lunch, with their phone tucked away.";
  } else if (currentScenario === "personal") {
    recipientReply.textContent = "Of course we can talk. Sorry—I was on the subway and just got service.";
    ordinaryEvent = "Alex was underground on the subway without a signal.";
  } else {
    recipientReply.textContent = "I'm in! Sorry, I was in class with my phone silenced.";
    ordinaryEvent = "Alex was finishing a class and had silenced their phone.";
  }

  actualExplanation.textContent = ordinaryEvent;

  if (interpretation === "busy") {
    reflectionText.textContent = `You imagined they were busy. ${ordinaryEvent} Your guess was close, though the unseen details were more ordinary than the waiting felt.`;
  } else if (interpretation === "avoiding") {
    reflectionText.textContent = `You read the silence as avoidance. ${ordinaryEvent} The same quiet moment held two very different stories.`;
  } else {
    reflectionText.textContent = `You left the silence unresolved. ${ordinaryEvent} The answer was ordinary, even while several explanations felt possible.`;
  }
}

// Draw the correct chat content for the current reveal stage.
function renderReveal() {
  const guessHasBeenMade = interpretation !== "";

  revealArea.hidden = revealStage === "hidden";
  typingBubble.hidden = revealStage !== "typing";
  recipientReply.hidden = revealStage !== "revealed";
  revealDetails.hidden = revealStage !== "revealed";

  if (revealStage === "typing") {
    revealButton.textContent = "Alex is typing…";
    revealButton.disabled = true;
    revealHint.textContent = "A reply is arriving.";
  } else if (revealStage === "revealed") {
    revealButton.textContent = "Other side revealed";
    revealButton.disabled = true;
    revealHint.textContent = "The silence now has an explanation.";
  } else {
    revealButton.textContent = "Reveal the Other Side";
    revealButton.disabled = !guessHasBeenMade;
    revealHint.textContent = guessHasBeenMade
      ? "Your interpretation is set. The other side is still hidden."
      : "Choose what you think the silence means first.";
  }
}

// Changing an input hides any old reveal and cancels a reply that is still pending.
function resetReveal() {
  clearTimeout(revealTimerId);
  revealTimerId = null;
  revealStage = "hidden";
}

// Keep all time-related text and styling in sync.
function updateTimeDisplay() {
  if (waitingTime === 0) {
    timeOutput.textContent = "0 minutes";
    seenTime.textContent = "just now";
  } else if (waitingTime === 1) {
    timeOutput.textContent = "1 minute";
    seenTime.textContent = "1 minute ago";
  } else if (waitingTime === 120) {
    timeOutput.textContent = "2 hours";
    seenTime.textContent = "2 hours ago";
  } else if (waitingTime >= 60) {
    const hours = Math.floor(waitingTime / 60);
    const minutes = waitingTime % 60;
    timeOutput.textContent = minutes === 0 ? `${hours} hour` : `${hours}h ${minutes}m`;
    seenTime.textContent = `${waitingTime} minutes ago`;
  } else {
    timeOutput.textContent = `${waitingTime} minutes`;
    seenTime.textContent = `${waitingTime} minutes ago`;
  }

  const progressPercent = (waitingTime / 120) * 100;
  timeSlider.style.setProperty("--slider-progress", `${progressPercent}%`);
}

// A single render function redraws the page from the current state.
function renderExperience() {
  updateConversation();
  updateTimeDisplay();
  updateThought();
  renderReveal();
}

// EVENT LISTENERS
// Changing the dropdown updates the scenario state, then redraws the page.
scenarioSelect.addEventListener("change", function () {
  currentScenario = scenarioSelect.value;
  resetReveal();
  renderExperience();
});

// Moving the slider updates the waiting-time state, then redraws the page.
timeSlider.addEventListener("input", function () {
  waitingTime = Number(timeSlider.value);
  resetReveal();
  renderExperience();
});

// Choosing a meaning updates the interpretation state, then redraws the page.
interpretationChoices.forEach(function (choice) {
  choice.addEventListener("change", function () {
    interpretation = choice.value;
    resetReveal();
    renderExperience();
  });
});

// The button first shows typing, then reveals the reply after a short pause.
revealButton.addEventListener("click", function () {
  if (interpretation === "" || revealStage !== "hidden") {
    return;
  }

  revealStage = "typing";
  renderReveal();

  revealTimerId = setTimeout(function () {
    revealStage = "revealed";
    updateRevealContent();
    renderReveal();
  }, 1500);
});

// Draw the starting state when the page first loads.
renderExperience();
