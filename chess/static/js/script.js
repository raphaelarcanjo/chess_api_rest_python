// CHESS TABLE FUNCTIONS
const alfabet = "abcdefghijklmnopqrstuvwxyz"

let col = []
let row = 0

const render_board = () => {
    let board_content = $('<div>')
    let color = true
    let board_row = $('<div class="board-row">')
    let square = $('<div class="square">')
    let coord_row = $('<div>')
    let coord_col = $('<div>')

    // COLUMN RENDERING
    for(i = 0; i < col.length; i++) {
        let new_square = square.clone()
        if (color) new_square.addClass("dark")
        else new_square.addClass("light")
        board_row.append(new_square)
        coord_col.append($('<li class="nav-item h3">' + alfabet[i].toUpperCase() + '</li>'))
        color = !color
    }

    // ROW RENDERING
    for(i = 1; i <= row; i++) {
        let new_board_row = board_row.clone()
        $(new_board_row).data('coordinate', i)
        if (i % 2 == 0) {
            $(new_board_row).find('div.square.light').removeClass('light').addClass('temp')
            $(new_board_row).find('div.square.dark').removeClass('dark').addClass('light')
            $(new_board_row).find('div.square.temp').removeClass('temp').addClass('dark')
        }
        $(board_content).prepend(new_board_row)
        $(coord_row).prepend($('<li class="nav-item h3">' + i + '</li>'))
    }

    // APPEND TO DOM
    $('div.chess-board div.content').html(board_content)
    $('ul.coordinates.column-coordinates').html(coord_col.html())
    $('ul.coordinates.row-coordinates').html(coord_row.html())
    $('input#number_rows').val(row)
    $('input#number_columns').val(col.length)

    // CREATE EVENT LISTENER FOR THE SQUARES
    $('div.square').on('click', function() {
        send_coordinates($(this))
    })
}

const add_row = (number = 1) => {
    row += number
    $('input#number_rows').val(row)
}

const add_column = (number = 1) => {
    if (number + col.length > alfabet.length) col = alfabet.split('')
    else col = alfabet.slice(0, col.length + number).split('')
}

const remove_row = (number = 1) => {
    if (row > 1) row -= number
}

const remove_column = (number = 1) => {
    if (col.length > 1) {
        for(i = 0; i < number; i++) {
            col.pop()
        }
    }
}

const send_coordinates = div_square => {
    let row = $(div_square).closest('div.board-row')
    let coordinates = [$(row).data('coordinate'), alfabet[$(row).find(div_square).index()]]
    console.log(coordinates)
}

add_column(8)
add_row(8)
render_board()

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

$('button.add-row').on('click', function() {
    add_row()
    render_board()
})

$('button.add-column').on('click', function() {
    add_column()
    render_board()
})

$('button.remove-row').on('click', function() {
    remove_row()
    render_board()
})

$('button.remove-column').on('click', function() {
    remove_column()
    render_board()
})
