const options = {
    string: val => typeof val === 'string',
    array: val => Array.isArray(val),
    object: val => JSON.parse(val) instanceof Object,
    url: val => isURL(val),
    email: val => isEmail(val),
    phone: val => isPhone(val),
    int: val => typeof val === 'number',
}

function checkType (val, type) {
    if (type instanceof Array) {
        return type.some(typ => checkType(val, typ))
    }
    return options[type] && options[type](val) || false
}

const checkLength = function (length, [min, max]) {
    return length >= min && length <= max
}

exports.validate = (body, validationMap) => {
    let valid = true
    Object.entries(body).every(([key, val]) => {

        valid = checkType(val, validationMap[key].type)
        if (!valid) {
            return false
        }

        if (Array.isArray(val)) {
            val = val.join(',')
        }

        if (validationMap[key].length) {
            valid = checkLength(val.length, validationMap[key].length)
            if (!valid) return false
        }
        if (validationMap[key].escape) {
            val = escape(val)
        }
        return true
    })
    return !valid ? false : body
}


const escape = function(val) {
    return val.replace(/[^\w\s'":!?.-/,]/g, '')
}

const isURL = function (val) {
    return /^https:\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i.test(val)
}

const isPhone = function(val) {
    // TODO
    return true
}

const isEmail = function (val) {
    return /\S+@{1}\S+\.{1}\S+/.test(val)
}