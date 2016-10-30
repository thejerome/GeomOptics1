var els = new Array;
var subsidiaryEls = new Array;
lenses = new Array;
endPts = new Array;
arrayForParallel = new Array;
lensesPosition = new Array;
var incomingRay;
interspectionPointsArray = new Array;
interspectionPointsNumberArray = new Array;
function init_lab() {
    var window =
            '<div>' +
            '<div id="content" onselectstart="return false"></div>' +
            '<div id="buttonsBlock" class="buttonsBlock">' +
            '<div>' +
            '<button class="main" onclick="g_line();" id="line">Начертить луч</button>' +
            '</div>' +
            '<div>' +
            '<button class="subsidiary" onclick="g_line_parallel();" id="line_parallel">Вспомогательный луч (параллельный)</button>' +
            '<button class="subsidiary" onclick="g_line_two_points();" id="line_two_points">Вспомогательный луч (по 2 точкам)</button>' +
            '</div>' +
            '<div>' +
            '<button class="cancel" onclick="g_cancel();" id="cancel" title="Удаление последнего построенного фрагмента луча">Удалить<br>действительный<br>луч</button>' +
            '<button class="cancel" onclick="g_cancel_parallel();" id="cancel_parallel" title="Удаление последнего построенного вспомогательного луча">Удалить вспомогательный луч</button>' +
            '</div>' +
            '<div>' +
            '<button class="packet" onclick="raysMakePacketForSend();" id="makePacket">Проверить!</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="comments" class="comments"><noscript>У Вас отключен JavaScript! Включите его для корректной работы сраницы.</noscript></div>';

    function parse_result(str, default_object) {
        var parse_str;
        if (typeof str === 'string' && str !== "") {
            try {
                parse_str = str.replace(/<br\/>/g, "\r\n").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;br\/&gt;/g, "\r\n")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&minus;/g, "-").replace(/&apos;/g, "\'").replace(/&#0045;/g, "-");
                parse_str = JSON.parse(parse_str);
            } catch (e) {
                if (default_object){
                    parse_str = default_object;
                } else {
                    parse_str = false;
                }
            }
        } else {
            if (default_object){
                parse_str = default_object;
            } else {
                parse_str = false;
            }
        }
        console.log(parse_str)
        return parse_str;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null) {
            variant = parse_result($("#preGeneratedCode").val(), default_variant);
        } else {
            variant = default_variant;
        }
        return variant;
    }

    function draw_previous_solution(previous_solution) {
        $(".control_tube_radius_slider").val(previous_solution.tube_radius);
        change_tube_radius_value();
        radius_coefficient = create_radius_coefficient($(".control_tube_radius_slider").val());
        $(".control_pressure_drop_slider").val(previous_solution.delta_p);
        change_pressure_drop_value();
        pressure_coefficient = create_pressure_coefficient($(".control_pressure_drop_slider").val());
        draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
        $(".viscosity_coefficient_value").val(previous_solution.mu);
        viscosity_coefficient = previous_solution.mu;
        init_plot(laboratory_variant.tau_gamma_values, ".block_viscosity_plot svg",
            $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"), viscosity_coefficient);
    }

    return {
        init: function () {
            lensesPosition = [];
            laboratory_variant = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            cnv = document.getElementById('content');
            var incomingData = get_variant();
            drawCanvasWithLenses(incomingData);
            drawRay(incomingData[incomingData.length - 2], 360 - incomingData[incomingData.length - 1]);
            onloadRay();
             /*fill_installation(laboratory_variant);
             if ($("#previousSolution") !== null && $("#previousSolution").length > 0 && parse_result($("#previousSolution").val())) {
             var previous_solution = parse_result($("#previousSolution").val());
                draw_previous_solution(previous_solution);
            }
            $(".btn_help").click(function () {
                show_help();
            });
            $(".control_tube_radius_slider").change(function () {
                change_tube_radius_value();
                radius_coefficient = create_radius_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_pressure_drop_slider").change(function () {
                change_pressure_drop_value();
                pressure_coefficient = create_pressure_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_tube_radius_value").change(function () {
                if ($(this).val() < MIN_TUBE_RADIUS) {
                    $(this).val(MIN_TUBE_RADIUS)
                } else if($(this).val() > MAX_TUBE_RADIUS){
                    $(this).val(MAX_TUBE_RADIUS)
                }
                change_tube_radius_slider();
                radius_coefficient = create_radius_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".control_pressure_drop_value").change(function () {
                if ($(this).val() < MIN_PRESSURE_DROP) {
                    $(this).val(MIN_PRESSURE_DROP)
                } else if($(this).val() > MAX_PRESSURE_DROP){
                    $(this).val(MAX_PRESSURE_DROP)
                }
                change_pressure_drop_slider();
                pressure_coefficient = create_pressure_coefficient($(this).val());
                draw_tube($(".tube_canvas"), radius_coefficient, pressure_coefficient);
            });
            $(".btn_play").click(function () {
                launch();
            });
            $(".viscosity_coefficient_value").change(function () {
                if ($(this).val() <= 0) {
                    $(this).val(0)
                }
                viscosity_coefficient = $(this).val();
                init_plot(laboratory_variant.tau_gamma_values, ".block_viscosity_plot svg",
                    $(".block_viscosity_plot svg").attr("width"), $(".block_viscosity_plot svg").attr("height"), $(this).val());
            });*/
        },
        calculateHandler: function () {
            var calculate_data = parse_result(arguments[0], default_calculate_data);
            unfreeze_installation(calculate_data);
        },
        getResults: function () {
            var answer = {mu: viscosity_coefficient, delta_p: pressure_drop, tube_radius: tube_radius};
            return JSON.stringify(answer);
        },
        getCondition: function () {
            var condition = {mu: viscosity_coefficient, delta_p: pressure_drop, tube_radius: tube_radius};
            return JSON.stringify(condition);
        }
    }
}

var Vlab = init_lab();