var availableTags = [];

$('#sidebar-categories').children(':not(:first-child)').on('click', function () {
    let category = $(this).attr('id').substring($(this).attr('id').indexOf('-'));
    category = category.substring('1');
    let new_arr = JSON.parse($('#categories').attr('filenames_arr')).filter((x) => { return x.category === category })[0].filenames;
    availableTags = [];
    new_arr.forEach(x => { availableTags.push(x.slice(0, x.lastIndexOf('.'))) })
    $(this).addClass('active');
    $('.loader').removeClass('hidden');
    $('#sidebar-categories').children().not($(this)).removeClass('active');
    $.post(`/${category}`, function (data) {
        $('.icon-item').remove();
        data.category.fileNames.forEach((x, index, arr) => {
            $('#icons').append(`<div class="icon-item" category="${data.category.category}" filename="${x}"><img src="/img/icons/${data.category.category}/${x}" alt=""></div>`);
            if (index === arr.length - 1) {
                $('.loader').addClass('hidden');
            }
        })
    });
})

$('#category-All').click(function () {
    if (!$(this).hasClass('active')) {
        $('.loader').removeClass('hidden');
        $('.icon-item').remove();
        listAllfiles();
        $(this).addClass('active');
        $('#sidebar-categories').children().not($(this)).removeClass('active');
        availableTags = [];
        ($('#allFiles_arr').attr('filenames_arr').split(',')).forEach(x => { availableTags.push(x.slice(0, x.lastIndexOf('.'))) });
    }
})

function searchIcons(value) {
    var value = value
    $(".icon-item").each(function () {
        if ($(this).attr('filename').toLowerCase().indexOf(value) > -1) {
            $(this).removeClass("hidden")
        }
        else {
            $(this).addClass("hidden")
        }
    })
}

$('body').on('click', '.icon-item', function () {
    $("#open-icon-modal").fadeIn('fast');
    let category = $(this).attr('category');
    let file = $(this).attr('filename');
    $.get(`/svg?category=${category}&&file=${file}`, function (data) {
        $('#icon-item-modal-display').empty().append(data.svg);
        $('#icon-item-modal-display').find('svg').attr({ 'id': 'svgElem', 'filename': file, 'category': category });
    });

})

function downloadSVGAsText() {
    const svg = document.getElementById('svgElem');
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const a = document.createElement('a');
    const e = new MouseEvent('click');
    a.download = 'download.svg';
    a.href = 'data:image/svg+xml;base64,' + base64doc;
    a.dispatchEvent(e);
}

$('#customize_btn').click(function () {
    let category = $('#icon-item-modal-display').find('svg').attr('category');
    window.location.href = `/editroom?category=${category}&&file=${$('#icon-item-modal-display').find('svg').attr('filename')}`;
})


let searchinput = $('#search_icons');
const speechRecongnition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (speechRecongnition) {
    const recognition = new speechRecongnition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    $('.fa-microphone').on('click', function () {
        if ($(this).hasClass('fa-microphone')) {
            recognition.start()
        } else {
            recognition.stop();
        }
    })
    recognition.addEventListener('result', resultOfSpeech)
    function resultOfSpeech(event) {
        $('#voice_result_input').val(event.results[0][0].transcript);
    }
    recognition.addEventListener('soundend', onNoSound)
    function onNoSound() {
        recognition.stop();
    }
    function voice_search_abort() {
        $(`#open-voice-search-modal`).fadeOut('fast');
        recognition.abort();
    }
    $("#voice-search-btn").click(function () {
        searchIcons($('#voice_result_input').val());
        $(`#open-voice-search-modal`).fadeOut('fast');
        recognition.stop();
    })

}

$(window).scroll(function () {
    if (($(window).scrollTop() + $(window).height() == $(document).height()) && $('#category-All').hasClass('active')) {
        $('.loader').removeClass('hidden');
        listAllfiles();
    }
});

function listAllfiles() {
    $.get(`/loadmore?skip=${$('.icon-item').length}`, function (data) {
        data.allFiles.forEach(function (x, index, arr) {
            let category = x.split('+')[1];
            let file = x.split('+')[0];
            $('#icons').append(`<div class="icon-item" category="${category}" filename="${file}"><img src="/img/icons/${category}/${file}" alt=""></div>`);
            if (index === arr.length - 1) {
                $('.loader').addClass('hidden');
            }
        })
    })
}

($('#allFiles_arr').attr('filenames_arr').split(',')).forEach(x => { availableTags.push(x.slice(0, x.lastIndexOf('.'))) });
$("#search_icons").autocomplete({
    source: function (request, response) {
        response($.ui.autocomplete.filter(availableTags, request.term).slice(0, 5));
    },
    autoFill: true,
    maxResults: 10,
    select: function (event, ui) {
        if (ui.item.value === "") {
            console.log('empty')
        }
        searchIcons(ui.item.value);
    }
})

    .on('keypress', function (e) {
        searchIcons($(this).val());

        if ($('#category-All').hasClass('active')) {
            $.get(`/search?${$(this).val}`,function (data) {
                console.log(data);
            })
        }
    })


