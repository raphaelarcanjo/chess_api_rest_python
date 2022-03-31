const list_pieces = form => {
    console.log($(form).serialize())
    $.ajax({
        url: '/pieces/register',
        type: 'post',
        data: $(form).serialize(),
        success: html => {
            $('div.pieces-list').html(html)
        }
    })
}

$('form.piece-register').on('submit', function(e) {
    list_pieces($(this))
    e.preventDefault()
})
