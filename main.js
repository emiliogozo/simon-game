$(document).ready(function () {
    var isStarted = false;
    var isStrict = false;
    var isBtnDisabled = false;
    var pressArr = [];
    var userArr = [];
    var gameInterval;

    var GAME_MAX = 20; // max game

    // load sounds
    [1, 2, 3, 4].forEach(function (id) {
        soundManager.createSound({
            id: "btn"+id+"Sound",
            url:"https://s3.amazonaws.com/freecodecamp/simonSound"+id+".mp3",
            // begin loading right away
            autoLoad: true
        });
    });
    var errorSound = soundManager.createSound({
        url: 'assets/error.mp3',
        // begin loading right away
        autoLoad: true
    });

    // start/stop botton click
    $("#start-stop-btn").click(function () {
        if (!isStarted) {
            gameStart();
        } else {
            gameStop();
        }
    });

    // strict botton click
    $("#strict-btn").click(function () {
        if (!isStrict) {
            $("#strict-led").addClass("led-on");
            isStrict = true;
        } else {
            $("#strict-led").removeClass("led-on");
            isStrict = false;
        }
    });

    // simon buttons
    $("[id^=btn-]").click(function (ev) {
        if (isStarted && !isBtnDisabled) {
            var id = parseInt($(this).attr("id").slice(-1));
            userArr.push(id);
            soundManager.play("btn" + id + "Sound");
            checkUserPress();
        }
    });

    function gameStart() {

        // toggle start -> stop button
        $("#start-stop-btn").css("background-color", "#d50000");
        $("#start-stop-btn").siblings("label").text("Stop");

        // if start of game, show ready animation
        var blinkDuration = 500;
        if (!isStarted) {
            $('#count-txt').text("--")
                .fadeIn(blinkDuration, activateBtn).fadeOut(blinkDuration, deactivateBtn)
                .fadeIn(blinkDuration, activateBtn).fadeOut(blinkDuration, deactivateBtn)
                .fadeIn(blinkDuration, activateBtn).fadeOut(blinkDuration, function () {
                    deactivateBtn();
                    isStarted = true;
                    $(this).fadeIn(blinkDuration).text("01");
                    setTimeout(function () {
                        showPress(true);
                    }, blinkDuration);
                });
        }

        function activateBtn() {
            $("#btn-1").addClass("btn1-active");
            $("#btn-2").addClass("btn2-active");
            $("#btn-3").addClass("btn3-active");
            $("#btn-4").addClass("btn4-active");
            soundManager.play("btn1Sound");
        }

        function deactivateBtn() {
            $("#btn-1").removeClass("btn1-active");
            $("#btn-2").removeClass("btn2-active");
            $("#btn-3").removeClass("btn3-active");
            $("#btn-4").removeClass("btn4-active");
        }
    }

    function gameStop() {
        // toggle stop -> start button
        $("#start-stop-btn").css("background-color", "#00C853");
        $("#start-stop-btn").siblings("label").text("Start");

        // reset the press array
        pressArr = [];
        // reset count display
        $('#count-txt').text("");
        isStarted = false;
    }

    function showPress(increment) {
        var delayDuration = 1600;

        if (increment) {
            // add new button press
            if (pressArr.length < GAME_MAX) {
                pressArr.push(Math.floor(Math.random() * 4) + 1);
                displayCount();
            } else { // user wins
                alert("Congratulations !!!");
                gameStop();
                return false;
            }
        } else if (isStrict) {
            // stric mode
            // create new random sequence
            var pressCount = pressArr.length;
            pressArr = [];
            for (k=0; k<pressCount; k++) {
                pressArr.push(Math.floor(Math.random() * 4) + 1);
            }
        }

        var i = 0;
        toggleBtnDisable();
        gameInterval = setInterval(function () {
            var id = pressArr[i];
            $("#btn-" + id).addClass("btn" + id + "-active");
            soundManager.play("btn" + id + "Sound");
            setTimeout(function () {
                $("#btn-" + id).removeClass("btn" + id + "-active");
            }, delayDuration / 2);
            if (++i == pressArr.length) {
                toggleBtnDisable();
                clearInterval(gameInterval);
            }
        }, delayDuration);
    }

    function checkUserPress() {
        var correct;
        var userIdx = userArr.length - 1;

        correct = userArr[userIdx] == pressArr[userIdx];
        if (!correct) {
            $('#count-txt').text("ERR");
            errorSound.play();
            displayCount();
            userArr = [];
            showPress(false);
        } else if (correct && (userArr.length == pressArr.length)) {
            userArr = [];
            showPress(true);
        }
    }

    function displayCount() {
        var delayDuration = 500;
        var count = pressArr.length;
        setTimeout(function () {
            if (count < 10) {
                $('#count-txt').text("0" + count);
            } else {
                $('#count-txt').text(count);
            }
        }, delayDuration);
    }

    function toggleBtnDisable() {
        if(isBtnDisabled) {
            isBtnDisabled = false;
            $("[id^=btn-]").addClass("clickable");
        } else {
            isBtnDisabled = true;
            $("[id^=btn-]").removeClass("clickable");
        }

    }
});