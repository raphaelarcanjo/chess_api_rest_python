// CHESS TABLE FUNCTIONS
const alfabet = "abcdefghijklmnopqrstuvwxyz"

let col = []
let row = 0

const render_board = () => {
    let board_content = $('<div>')
    let color = true
    let board_row = $('<div class="board-row">')
    let square = $('<div class="square">')
    for(i = 0; i < col.length; i++) {
        let new_square = square.clone()
        if (color) new_square.addClass("dark")
        else new_square.addClass("light")
        new_square.data('coordinate', alfabet[i])
        board_row.append(new_square)
        color = !color
    }
    for(i = 1; i <= row; i++) {
        let new_board_row = board_row.clone()
        new_board_row.data('coordinate', i)
        if (i % 2 == 0) {
            $(new_board_row).find('div.square.light').removeClass('light').addClass('temp')
            $(new_board_row).find('div.square.dark').removeClass('dark').addClass('light')
            $(new_board_row).find('div.square.temp').removeClass('temp').addClass('dark')
        }
        $(board_content).prepend(new_board_row)
    }
    $('div.chess-board').html(board_content)
}

const add_row = (number = 1) => {
    row += number

    render_board()
}

const add_col = (number = 1) => {
    if (number + col.length > alfabet.length) col = alfabet.split('')
    else col = alfabet.slice(0, col.length + number).split('')

    render_board()
}

const remove_row = (number = 1) => {
    if (row > 1) row -= number
    render_board()
}

const remove_col = (number = 1) => {
    if (col.length > 1) {
        for(i = 0; i < number; i++) {
            col.pop()
        }

        render_board()
    }
}

add_col(8)
add_row(8)

// PIECES FUNCTIONS
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
