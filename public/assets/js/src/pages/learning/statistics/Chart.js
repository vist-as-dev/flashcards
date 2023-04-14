import ChartJS from 'chart.js/auto';

export class Chart {
    #body;

    #statistics;
    #options;

    #chart;

    constructor({storage: {statistics}}, state) {
        this.#body = document.querySelector('div#learning div#statistics [data-component="chart"]');
        statistics.subscribe((statistics) => {
            this.#statistics = statistics;
            this.render();
        });
        state.subscribe(options => {
            this.#options = options
            this.render();
        });
    }

    render() {
        if (!this.#statistics || !this.#options) {
            return;
        }

        const data = this.#data;

        this.#chart && this.#chart.destroy();

        this.#chart = new ChartJS(
            this.#body,
            {
                type: 'bar',
                data: {
                    labels: Object.keys(data),
                    datasets: [
                        ...(this.#options.types.includes('started') ? [{
                            label: 'Started',
                            data: Object.values(data).map(({started}) => started || 0)
                        }] : []),
                        ...(this.#options.types.includes('repeated') ? [{
                            label: 'Repeated',
                            data: Object.values(data).map(({repeated}) => repeated || 0)
                        }] : []),
                        ...(this.#options.types.includes('completed') ? [{
                            label: 'Completed',
                            data: Object.values(data).map(({completed}) => completed || 0)
                        }] : []),
                        ...(this.#options.types.includes('wellKnown') ? [{
                            label: 'Already known',
                            data: Object.values(data).map(({wellKnown}) => wellKnown || 0)
                        }] : []),
                    ]
                }
            }
        );
    }

    get #data() {
        const result = {};
        const now = new Date();
        const endDate = new Date(now.getTime());

        const byDay = () => {
            while (endDate.getTime() <= now.getTime()) {
                result[`${endDate.getMonth() + 1}/${endDate.getDate()}`] = this.#statistics[endDate.toLocaleDateString()] || {};
                endDate.setDate(endDate.getDate() + 1);
            }
            return result;
        }

        const byMonth = () => {
            while (endDate.getTime() <= now.getTime()) {
                if (!result[`${endDate.getFullYear()}/${endDate.getMonth() + 1}`]) {
                    result[`${endDate.getFullYear()}/${endDate.getMonth() + 1}`] = {};
                }
                Object.keys(this.#statistics[endDate.toLocaleDateString()] || {}).forEach(key => {
                    result[`${endDate.getFullYear()}/${endDate.getMonth() + 1}`][key] = (result[`${endDate.getFullYear()}/${endDate.getMonth() + 1}`][key] || 0) + ((this.#statistics[endDate.toLocaleDateString()] || {})[key] || 0)
                });
                endDate.setDate(endDate.getDate() + 1);
            }
            return result;
        }

        switch (this.#options.period) {
            case 'week':
                endDate.setDate(now.getDate() - 7);
                return byDay();
            case 'month':
                endDate.setMonth(now.getMonth() - 1);
                return byDay();
            case '3months':
                endDate.setMonth(now.getMonth() - 3);
                return byDay();
            case '6months':
                endDate.setMonth(now.getMonth() - 6);
                return byMonth();
            case 'year':
                endDate.setMonth(now.getMonth() - 12);
                return byMonth();
            case 'total':
                const dates = Object.keys(this.#statistics).map(key => new Date(key));
                endDate.setTime((new Date(Math.min.apply(null, dates))).getTime());
                return byMonth();
        }

        return result
    }
}