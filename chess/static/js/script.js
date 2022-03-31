const list_pieces = form => {
    $.ajax({
        url: '/pieces/register',
        type: 'post',
        data: $(form).serialize() + '&csrfmiddlewaretoken=' + $('input[name=csrfmiddlewaretoken]').val(),
        done: html => {
            $('div.pieces-list').html(html)
        }
    })
}

$('form.piece-register').on('submit', e => {
    e.preventDefault()
    list_pieces($(this))
})
