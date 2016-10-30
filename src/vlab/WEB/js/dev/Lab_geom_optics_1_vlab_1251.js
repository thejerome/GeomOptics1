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
        '<button class="main" onclick="g_line();" type="button" id="line">Начертить луч</button>' +
        '</div>' +
        '<div>' +
        '<button class="subsidiary" onclick="g_line_parallel();" type="button" id="line_parallel">Вспомогательный луч (параллельный)</button>' +
        '<button class="subsidiary" onclick="g_line_two_points();" type="button" id="line_two_points">Вспомогательный луч (по 2 точкам)</button>' +
        '</div>' +
        '<div>' +
        '<button class="cancel" onclick="g_cancel();" type="button" id="cancel" title="Удаление последнего построенного фрагмента луча">Удалить<br>действительный<br>луч</button>' +
        '<button class="cancel" onclick="g_cancel_parallel();" type="button" id="cancel_parallel" title="Удаление последнего построенного вспомогательного луча">Удалить вспомогательный луч</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="comments" class="comments"><noscript>У Вас отключен JavaScript! Включите его для корректной работы сраницы.</noscript></div>';
    var variant = null;
    
    function setVariant(varianInsideFunction) {
        variant = parse_result(varianInsideFunction, null);
    }

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
        return parse_str;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null &&
                variant == null) {
            variant = parse_result($("#preGeneratedCode").val(), null);
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
            //Если что-то осталось от прошлых лаб - занулим
            els = [];
            subsidiaryEls = [];
            lenses = [];
            endPts = [];
            arrayForParallel = [];
            lensesPosition = [];
            interspectionPointsArray = [];
            interspectionPointsNumberArray = [];
            //обнуление закончилось
            laboratory_variant = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            var cnv = document.getElementById('content');
            var incomingData = get_variant();
            drawCanvasWithLenses(incomingData);
            drawRay(incomingData[incomingData.length - 2], 360 - incomingData[incomingData.length - 1]);
            onloadRay();
        },
        calculateHandler: function () {
        },
        getResults: function () {
            return JSON.stringify(raysMakePacketForSend());
        },
        getCondition: function () {
        }
    }
}

var Vlab = init_lab();