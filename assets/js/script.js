document.addEventListener('DOMContentLoaded', function () {
    const unsplashUrl               = 'https://api.unsplash.com/search/collections'
    const unsplashAccessKey         = 'qcejNjJsm568wTH7QyLoplDYs59Xjj_8tqb24bq2jAI'
    const unsplashPaginateLimit     = 16

    new Vue({
        el: '#unsplash',
        data: {
            resultPhrase: '',
            resultView: 'list',
            resultFound: 0,
            resultPaginate: 1,
            resultLoading: false,
            resultContent: []
        },
        created: function () {
            this.getListView()
        },
        methods: {
            setListView: function( style ) {
                this.resultView = style

                localStorage.setItem('unsplashResultView', style)
            },
            getListView: function() {
                if(localStorage.getItem('unsplashResultView')) {
                    this.resultView = localStorage.getItem('unsplashResultView')
                }
            },
            getFormatedDate: function ( date ) {
                return moment(date).format('L')
            },
            getStar: function ( date ) {
                let compareDate = Math.abs(moment(date).diff(Date.now(), 'days'));
                
                return (compareDate <= 14) ? true : false;
            },
            searchPhrase: function() {
                this.resultContent = []
                this.resultPaginate = 1
                this.resultLoading = true

                this.getContent( this.resultPhrase, 1, unsplashPaginateLimit)
            },
            getContent: function( query, page, per_page ) {
                const url = new URL(unsplashUrl);
                        url.searchParams.append('query', query)
                        url.searchParams.append('page', page)
                        url.searchParams.append('per_page', per_page)
                        url.searchParams.append('client_id', unsplashAccessKey)
                let self = this;

                axios
                    .get(url.toString())
                    .then(function (response) {
                        let currentResults = self.resultContent

                        self.resultLoading  = false
                        self.resultFound    = response.data.total
                        self.resultContent  = currentResults.concat(response.data.results)
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            },
            loadMoreContent: function() {
                window.onscroll = () => {
                    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                    if (bottomOfWindow) {
                        this.resultPaginate = this.resultPaginate + 1
                        this.getContent( this.resultPhrase, this.resultPaginate, unsplashPaginateLimit)
                    }
                }
            }
        },
        mounted: function() {
            this.loadMoreContent()
        }
    })
})
