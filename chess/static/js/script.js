// CHESS TABLE FUNCTIONS
const alfabet = "abcdefghijklmnopqrstuvwxyz"

let col = 0
let row = 0
let moves = []
let last_field = ""

const show_moves = () => {
    $('div.square.selected').removeClass('selected')

    // SELECT THE POSSIBLE MOVES
    $(moves).each(function() {
        let row_index = $(this)[0] - 1
        let column_index = alfabet.indexOf($(this)[1])
        if (row_index >= 1 && column_index >= 0 && (column_index + 1) <= col && (row_index + 1) <= row) {
            let board_row = $($('div.chess-board').find('div.board-row').get().reverse()).eq(row_index)
            $(board_row).find('div.square').eq(column_index).addClass('selected')
        }
    })

    // SELECT THE ORIGIN (THE INFORMED COORDINATE)
    let origin = $('form.get-knight-moves input.coordinates').val()
    if (origin) last_field = origin
    let row_index = last_field.substring(0, last_field.length - 1) - 1
    let column_index = alfabet.indexOf(last_field[last_field.length - 1])
    let board_row = $($('div.chess-board').find('div.board-row').get().reverse()).eq(row_index)
    $(board_row).find('div.square').eq(column_index).addClass('clicked')

    // CLEAR FIELDS
    $('form.get-knight-moves input.coordinates, form.get-knight-moves input.piece-id').val('')
}

const render_board = () => {
    let board_content = $('<div>')
    let color = true
    let board_row = $('<div class="board-row">')
    let square = $('<div class="square">')
    let coord_row = $('<div>')
    let coord_col = $('<div>')

    // COLUMN RENDERING
    for(i = 0; i < col; i++) {
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
    $('input#number_columns').val(col)

    // CREATE EVENT LISTENER FOR THE SQUARES
    $('div.square').on('click', function() {
        $('div.square.clicked').removeClass('clicked')
        $('div.square.selected').removeClass('selected')
        $(this).addClass('clicked')
        send_coordinates($(this))
    })

    if (moves.length > 0) show_moves()
}

const add_row = (number = 1) => {
    row += number
}

const add_column = (number = 1) => {
    if (number + col > alfabet.length) col = alfabet.length
    else col += number
}

const remove_row = (number = 1) => {
    if (row > 1) row -= number
}

const remove_column = (number = 1) => {
    if (col > 1) col -= number
}

const send_coordinates = div_square => {
    let row = $(div_square).closest('div.board-row')
    let coordinates = [$(row).data('coordinate'), alfabet[$(row).find(div_square).index()]]
    $('form.get-knight-moves input.coordinates').val(coordinates.join(''))
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
            success: function (json) {
                if (json.status) $(btn).closest('li').remove()
            }
        })
    }
}

const clear_fields = () => {
    $('form.piece-register input[name=name], form.piece-register input[name=id], form.piece-register input[name=color]').val('')
}

const get_piece_id = form => {
    $('p.comments').addClass('invisible')
    $.ajax({
        url: '/pieces/get_id',
        data: $(form).serialize(),
        success: function (json) {
            if (!json.error) {
                $('p.comments').text('The selected piece ID is: ' + json.piece.id).removeClass('invisible')
                $('form.get-knight-moves input.piece-id').val(json.piece.id).focus()
            }
            else $('p.comments').removeClass('invisible').text(json.error)
        }
    })
}

const get_knight_moves = form => {
    $('p.comments').addClass('invisible')
    $.ajax({
        url: '/pieces/get_knight_moves',
        data: $(form).serialize(),
        success: function (json) {
            if (!json.error) {
                moves = json.moves
                show_moves()
                get_history()
            }
            else $('p.comments').removeClass('invisible').text(json.error)
        }
    })
}

// HISTORY FUNCTIONS
const get_history = () => {
    $.ajax({
        url: '/history',
        success: function(html) {
            $('div.moves-history').html(html)
        }
    })
}

// EVENTS REGISTER
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

$('form.get-piece-id').on('submit', function(e) {
    get_piece_id($(this))
    e.preventDefault()
})

$('form.get-knight-moves').on('submit', function(e) {
    get_knight_moves($(this))
    e.preventDefault()
})

$('form.get-knight-moves input.piece-id').on('keyup', function() {
    $('p.comments').text('The selected piece ID is: ' + $(this).val()).removeClass('invisible')
})

$('input#number_rows').on('keyup', function() {
    row = $(this).val()
    render_board()
})

$('input#number_columns').on('keyup', function() {
    col = $(this).val()
    render_board()
})

$('form.get-knight-moves input.coordinates, form.get-knight-moves input.piece-id').val('')
get_history()
