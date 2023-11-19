const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique:true},
        password: {type: String, required: true},
        pic: {
            type:String,
            default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAACDCAMAAACZQ1hUAAAAaVBMVEUrLzLCxMPFx8YoLC/Jy8ocISUlKS0hJSkWGyC9v764urkiJyoYHiLNz84uMjWYmppaXV57fX6jpaWwsrFWWFpvcnJnamtOUVMQFhuPkZFJTE1hY2Q0ODs+QUOFh4hER0oAAAkADRQAAABr5NcqAAAE1ElEQVR4nO2b2ZajOAyGg3fArAYCCUtXv/9DjiFF93Q1JjaxqDlz8t/kqsrfkWRZks3l8tZbb731Fpgwm4XxtwFwkd6q+/1eTT0V/Ds4GG7KKAwQQkEYqaweLvRsDH5TBAWrECJIjYOIz0RgFfpN8MlBElUzesryOJZS/ii/IjzMEdYph0fgadNl2RhuICzGUDm0KTAdA0K0+7cRFopRgAYnvkTm1VeREjZhlM8RNEQGGBO0sEHQEKOAQsC9IRL/UnJjQAy8tjODDkwFFRHtZlLY9kYOlDKpLYE2RAkTEfhmbYYgCCcQb8R3BwbSgDjDPiRnhg7EGbx2sAOKPkAYLDPUp0COrrhxYUADRFCy3MEXAbpCpErmsjeBGPDFASFAMAniI3KB6EEYhP15oSUhEKzLh8UVMPnhwhw2JypbEAZ8tfcE6WB8gQf7oCQ1UE3JlXVQohymmsPSfmPA1A+MTj9H+4LyB6beKwg8KKJs62qtMgjvviGkbm+czgudIlK/CHhwWH/FuPuNS7eD+yFS+N2fzKWgXRlGv7XUf8EOuHJG0LnS78bAkzsDanznSofcsKryzCDtz4pVoe/S2q2IWhT5PjpdiqiH/Pfe7pvTd3qYB0FOVXUA0mG4OoOU/ispjJVTvxkOAJUUvmQosRwOElJOMBMpSZlVykYF54AD4w+bNBHFoMNim8iE6m9WscpiaF4AXx+kFufGDfhm67kzEOTY/iEWPTEEmaAG5r8ZnkQEeDTMEt0eBFJnXO3p02vPG9Upl5w8NxsC8ArnT1Fj74sADkuDhMkMCfyeWNWaIiI55655n+E0V+wwpKc9QKCmmEzO2Zla0jioRDDXN1+FWbtTTKG6hX6Wgjnv82xvKITKZmBwz1Iwp32dRWT/3EQkLIuBU4BEwWR7K0r0BGDFIGrMpfBZVuJYXPIuQn+9gdnBQCjMmt7Tm6U5BO5ZZGeBL+aIynpgr2Jg3qZNFrqv/wsD6eD4OB4cmMpbochhgBUjicaKCeZuDiYv11EFDiGwg4GCqMt7tydcjMe3Th0IAbMIibKc2c7RsaBVF73qgg2hJMzu2MIauq3VAF5csIVBNEYq90MD1ypwHTy5aX7dt3vC0zEBssAfGHtNMWawNli1V2Y4PnE4rL2WlLkPQo8pNN6GH7msOabEePXInV56vCJzzSeyk1yhO2NTQDjc474q00wfTwfuKA4KGd5wHbk3OyrTQN3cTvuXaX7o8DbRg7bfR4jwRAayGZS4P9MMZPNGnu2MePwLbV7A8uJMO2wfW7w7lUFtnRj81G0RBJvF1HlZclay8WLm3G0x11IbzmCl/3LeKN2LbvkC90U5txVQdf2v5REhQTkaJpm0bXFeZGr5xAJodd2Lj03ftjujGswoZ+lVg+hu36Nv5q+GQlUWVY9jajMb0SASD1XdqcfHT68ur/+Fyop8SqXV8v8G4UKk17orwyQ5FCX6b0iSBKor8p629EDz/wDBnAqJtUlKpePVLmLR4neiTZ/Nqwvt3dcnQtoklKf9VNVjVioVLh4iy0IL1ufvAhiGkVLZqC0/pIw62v45yYwiBE2H6Vrdm7oYx67rskVdN45F0dzz621ItQ9nx8N+naRpWMw5pVJKMUv/Ukp5PH/D+H0fMb711ltv/W/1D/mlRml7ujqHAAAAAElFTkSuQmCC",
        },
    },
    {
        timestamps: true,
    }
)

userModel.methods.matchPassword = async function (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

userModel.pre('save',async function (next){
    if(!this.isModified){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userModel)

module.exports = User