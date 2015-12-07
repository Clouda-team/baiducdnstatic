var Timer = {
	tmr: null,
	tm: 60,
	stopped: true,
	run: function(time, fn1, fn2)
	{
		if (time <= 0) return;
		Timer.tm = time;
		Timer.fn1 = fn1;
		Timer.fn2 = fn2;
		Timer.stopped = false;
		Timer.tmr = setInterval(function()
		{
			if (0 >= Timer.tm--)
			{
				Timer.fn2();
				Timer.stopped = true;
				clearInterval(Timer.tmr);
			}
			else
			{
				Timer.fn1();
			}
		}, 1000);
	},
	stop: function()
	{
		Timer.stopped = true;
		clearInterval(Timer.tmr);
		// Timer.tm = -1;
		return Timer;
	}
};
