class Boy {
    @speak('苹果')
    run () {
        console.log( ' i ate ' + this.food )
        console.log( ' i can run ')
    }
}

function speak (food){
    return function(target,key,descriptor) {
        console.log('target',target)
        target.food = food
        console.log('key',key)
        console.log('descriptor',descriptor)
    }
}

const luke = new Boy()

luke.run()