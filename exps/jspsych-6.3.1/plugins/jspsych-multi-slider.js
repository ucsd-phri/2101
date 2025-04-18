jsPsych.plugins['multi-slider'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'multi-slider',
    parameters: {
      instructions: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '',
        description: 'Initial instructions to be displayed above all slider questions.'
      },
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        default: undefined,
        description: 'Array of questions with slider scales.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var html = '<div id="jspsych-multi-slider-container">';

    // Add custom CSS to make sliders 644px wide and left align the prompts while centering sliders
    html += `
      <style>
        #jspsych-multi-slider-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .jspsych-multi-slider-question {
          display: flex;
          align-items: center;
          margin: 5px 0px; /* Minimize distance between prompts */
          width: 100%; /* Ensure the question div takes full width */
          justify-content: center; /* Center the slider horizontally */
        }
        .jspsych-multi-slider-prompt {
          margin-right: 5px; /* Space between prompt and slider */
          text-align: center;
          flex: 1; /* Make prompt take available space to the left */
        }
        .jspsych-multi-slider-question input[type=range] {
          width: 644px;
          margin-left: auto; /* Center slider within the container */
          margin-right: auto; /* Center slider within the container */
        }
      </style>
    `;
    
    // Add initial instructions prompt
    if (trial.instructions) {
      html += '<div id="jspsych-multi-slider-instructions" style="margin-bottom: 20px; text-align: center;">' + trial.instructions + '</div>';
    }


    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[i];
      html += '<div class="jspsych-multi-slider-question">';
      html += '<div class="jspsych-multi-slider-prompt">' + question.prompt + '</div>';
      html += '</div>';
      html += '<div class="jspsych-multi-slider-question">';
      html += '<input type="range" min="' + question.min + '" max="' + question.max + '" value="' + question.start + '" step="1" id="jspsych-multi-slider-' + i + '">';
      html += '</div>';
    }

    html += '<button id="jspsych-multi-slider-next" class="jspsych-btn">Continue</button>';
    html += '</div>';

    display_element.innerHTML = html;

    // Add event listeners to update the slider values
    for (var i = 0; i < trial.questions.length; i++) {
      var slider_id = 'jspsych-multi-slider-' + i;
      document.getElementById(slider_id).addEventListener('input', function(event) {
        // No need to update a visible value display
      });
    }

    display_element.querySelector('#jspsych-multi-slider-next').addEventListener('click', function() {
      var responses = [];
      for (var i = 0; i < trial.questions.length; i++) {
        var slider_id = 'jspsych-multi-slider-' + i;
        var response = document.getElementById(slider_id).value;
        responses.push({
          question: trial.questions[i].prompt,
          response: response
        });
      }

      var trial_data = {
        responses: JSON.stringify(responses)
      };

      display_element.innerHTML = '';

      jsPsych.finishTrial(trial_data);
    });
  };

  return plugin;
})();
