const save_pieces = form => {
    let piece_id = $(form).find('input[name=id]').val()
    let url = piece_id != '' ? '/pieces/save/' + piece_id : '/pieces/save'
    $.ajax({
        url,
        type: 'post',
        data: $(form).serialize(),
        success: function(json) {
            if (json.status) {
                clear_fields()
                list_pieces()
            }
            else alert('Error saving the piece')
        }
    })
}

const update_piece = btn => {
    let form = $('form.piece-register')
    $(form).find('input[name=id]').val($(btn).data('piece-id'))
    $(form).find('input[name=name]').val($(btn).data('piece-name')).focus()
    $(form).find('input[name=color]').val($(btn).data('piece-color'))
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
            url: '/pieces/delete/' + $(btn).data('id'),
            type: 'post',
            data: {csrfmiddlewaretoken: $('form.piece-register').find('input[name=csrfmiddlewaretoken]').val()},
            success: function (json) {
                if (json.status) $(btn).closest('li').remove()
            }
        })
    }
}

const clear_fields = () => {
    $('form.piece-register input[name=name], form.piece-register input[name=id], form.piece-register input[name=color]').val('')
}

$('form.piece-register').on('submit', function(e) {
    save_pieces($(this))
    e.preventDefault()
})
