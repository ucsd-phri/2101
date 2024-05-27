jsPsych.plugins['multi-slider2'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'multi-slider2',
    parameters: {
      instructions: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '',
        description: 'Instructions to be displayed above all slider questions.'
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

    // Add custom CSS to make sliders 644px wide and right align the prompts
    html += `
      <style>
        .jspsych-multi-slider-question {
          display: flex;
          align-items: center;
          margin: 10px 0px; /* Minimize distance between prompts */
        }
        .jspsych-multi-slider-prompt {
          margin-right: 10px; /* Space between prompt and slider */
          text-align: right;
          flex: 1; /* Make prompt take available space to the left */
        }
        .jspsych-multi-slider-question input[type=range] {
          width: 644px;
        }
      </style>
    `;
    
    // Add instructions prompt initially
    if (trial.instructions) {
      html += '<div id="jspsych-multi-slider-instructions" style="margin-bottom: 20px;">' + trial.instructions + '</div>';
    }

    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[i];
      if (i > 0 && i % 5 === 0) {
        html += '<div id="jspsych-multi-slider-instructions" style="margin-bottom: 20px;">' + trial.instructions + '</div>';
      }
      html += '<div class="jspsych-multi-slider-question">';
      html += '<div class="jspsych-multi-slider-prompt">' + question.prompt + '</div>';
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
        responses: responses
      };

      display_element.innerHTML = '';

      jsPsych.finishTrial(trial_data);
    });
  };

  return plugin;
})();
