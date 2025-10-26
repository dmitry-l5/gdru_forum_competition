export const BaseTask = {
    isCompleted: false,
    bot: null,
    target: null,

    init: function(options) {
        this.bot = options.bot;
        this.target = options.target;
        this.isCompleted = false;
    },


    breakCondition: function() {
        return this.bot.isDead || !this.target || this.target.isDead;
    },


    update: function(deltaTime) {
        console.warn(`BaseTask.update - This function must be overwritten by a concrete task.`);
    },

    run: function(deltaTime) {
        if (this.isCompleted) {
            return;
        }
        if (this.breakCondition()) {
            this.isCompleted = true;
            return;
        }
        this.update(deltaTime);
    },

    dispose: function() {
        this.bot = null;
        this.target = null;
        this.isCompleted = false;
    }
};