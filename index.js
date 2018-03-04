var http = require('http');

class PipelineBuilder {

	static build(functions, index = 0) {

		if (functions.length == index) return (sett) => { };

		let aggregateFunc = (settings) => functions[index](settings, PipelineBuilder.build(functions, index + 1));

		return aggregateFunc;
	}
}

class SimpleHttpServer {
	constructor(port) {

		this.port = port;
		this.settings = {};
		this.requestHandlers = [];
		this.httpRequestPipelineHandler = null;
	}

	use(requestHandler) {

		this.requestHandlers.push(requestHandler);
	}

	useSetting(key, value) {

		this.settings[key] = value;
	}

	start() {
		this.httpRequestPipelineHandler = PipelineBuilder.build(this.requestHandlers);

		http.createServer(function (req, res) {

			let env = this.settings;

			env.req = req;

			env.res = res;

			this.httpRequestPipelineHandler(env);

			res.end(); //end the response

		}.bind(this)).listen(this.port); //the server object listens on port 8080
	}
}
