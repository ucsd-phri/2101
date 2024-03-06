jsPsych.plugins["rank-order"] = {
    info: {
      name: "rank-order",
      parameters: {
        options: {
          type: jsPsych.plugins.parameterType.ARRAY,
          pretty_name: "Options",
          default: [],
          description: "The list of options to be ranked.",
        },
        prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: "Prompt",
          default: "",
          description: "The prompt to display above the ranking area.",
        },
      },
    },
    trial: function (display_element, trial) {
      var start_time = performance.now(); // Start time for reaction time
  
      var html = '<p>' + trial.prompt + '</p>';
      html += '<div style="margin: 0 auto; width: fit-content;">';
      html += '<div id="numbered-list" style="padding-right: 10px; display: inline-block;">';
      trial.options.forEach(function (option, index) {
        html += '<div>' + (index + 1) + '.</div>';
      });
      html += "</div>";
      html += '<div id="sortable" style="margin-top: 10px; display: inline-block;">';
      trial.options.forEach(function (option, index) {
        html += '<div class="ui-state-default" data-id="' + index + '">' + option + '</div>';
      });
      html += "</div>";
      html += "</div>";
      html += '<button id="jspsych-rank-order-next" class="jspsych-btn">Submit</button>';
  
      display_element.innerHTML = html;
  
      $("#sortable").sortable({
        containment: "parent",
        opacity: 0.6,
        cursor: "move",
      });
  
      $("#jspsych-rank-order-next").on("click", function () {
        var end_time = performance.now(); // End time for reaction time
        var rt = end_time - start_time; // Calculate reaction time
        var ranking = $("#sortable").sortable("toArray", { attribute: "data-id" });
        var data = {
          rt: rt,
          ranking: ranking.map(function(item) {
            return trial.options[item];
          }),
        };
  
        jsPsych.finishTrial(data);
      });
    },
  };
  