const register_pieces = form => {
    $.ajax({
        url: '/pieces/register',
        type: 'post',
        data: $(form).serialize(),
        success: function(json) {
            if (json.status) list_pieces()
            else alert('Error saving the piece')
        }
    })
}

const list_pieces = () => {
    $.ajax({
        url: '/pieces',
        success: function(html) {
            $('div.pieces-list').html(html)
        }
    })
}

const delete_piece = btn => {
    if (confirm('Are you sure you want delete this piece?')) {
        $.ajax({
            url: '/pieces/delete/',
            type: 'post',
            data: {id: $(btn).data('id'), csrfmiddlewaretoken: $('form.piece-register').find('input[name=csrfmiddlewaretoken]').val()},
            success: function (json) {
                if (json.status) $(btn).closest('li').remove()
            }
        })
    }
}

$('form.piece-register').on('submit', function(e) {
    register_pieces($(this))
    e.preventDefault()
})
