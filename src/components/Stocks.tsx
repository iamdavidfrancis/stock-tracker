import React, { Component } from 'react';
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StockChart from './StockChart';

const styles = (theme: any) => ({
  cardGrid: {
    padding: `${theme.spacing.unit * 1}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row' as any,
    flexWrap: "wrap" as any,
    justifyContent: 'space-between' as any,
  },
  cardHeader: {
    // paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    // flexGrow: 1,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  heading: {
    display: 'inline-block',
  },
  stockChart: {
    flexBasis: "100%",
    paddingLeft: `${theme.spacing.unit}px`,
    paddingRight: `${theme.spacing.unit}px`,
  },
  lastUpdate: {
    marginTop: `${theme.spacing.unit * 1}px`,
  }
});

interface IStockState {
  stocks: Array<IStock>;
  lastUpdateTime: Date;
  interval?: NodeJS.Timeout;
}

interface IStock {
  symbol: string;
  companyName: string;
  change: number;
  changePercent: number;
  delayedPrice: number;
  marketCap: number;
  chart: Array<IChartData>;
}

interface IChartResponseData {
  minute: string;
  average: number;
  volume: number;
}

interface IChartData {
  x: number | string;
  y: number;
}

interface IStockResponse {
  [symbol: string] : {
    quote : IStock,
    chart: Array<IChartResponseData>,
  }
}



class Stocks extends Component<any, IStockState> {

  private stocks = ["AAPL","MSFT","AMZN","GOOGL"];
  private getUrl = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${this.stocks.join(',')}&types=quote,chart&range=1d&chartInterval=5`;
  
  constructor(props: any) {
    super(props);

    this.state = {
      stocks: [],
      lastUpdateTime: new Date(),
      interval: undefined
    };
  }

  public async componentDidMount() {
    const response = await axios.get<IStockResponse>(this.getUrl);
    
    let stocks: Array<IStock> = [];
    this.stocks.forEach((val) => {
      const stock = response.data[val].quote;

      this.buildStockChartModel(stock, response.data[val].chart);

      stocks.push(stock);
    });

    stocks = stocks.sort((a, b) => b.marketCap - a.marketCap);

    const interval = setInterval(this.updateStocks, 1000 * 30);

    this.setState({stocks, lastUpdateTime: new Date(), interval});
  }

  public componentWillUnmount() {
    const { interval } = this.state;
    if (interval) {
      clearInterval(interval);
    }
  }

  public render() {
    const { classes } = this.props;
    const { stocks, lastUpdateTime } = this.state;

    return (
      <div className={classes.cardGrid}>
        <Grid container spacing={40}>
          {stocks.map(stock => (
            <Grid item key={stock.symbol} sm={6} md={3} lg={3}>
              <Card className={classes.card}>
                <CardHeader className={classes.cardHeader} title={stock.symbol} subheader={stock.companyName} />
                <CardHeader className={classes.marketCap} title={this.renderMarketCap(stock.marketCap)} subheader="Market Cap" subheaderTypographyProps={{align:"right"}} />
                {/* <CardContent className={classes.cardContent}>
                  <Typography component="h5" variant="h5" className={classes.heading}>
                    Market Cap
                  </Typography>
                </CardContent> */}
                {stock.chart && (
                  <div className={classes.stockChart}>
                    <StockChart data={stock.chart} isUp={stock.change > 0}/>
                  </div>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="caption" className={classes.lastUpdate}>
          Last Updated: {lastUpdateTime.toLocaleString()}
        </Typography>
      </div>
    );
  }

  private renderMarketCap = (marketCap: number) => {
    const inBillions = (marketCap / 1e9).toFixed(2);
    return `$${inBillions}B`;
  };

  private updateStocks = async () => {
    const response = await axios.get<IStockResponse>(this.getUrl);
    
    let stocks: Array<IStock> = [];
    this.stocks.forEach((val) => {
      const stock = response.data[val].quote;

      this.buildStockChartModel(stock, response.data[val].chart);

      stocks.push(stock);
    });

    stocks = stocks.sort((a, b) => b.marketCap - a.marketCap);

    this.setState({stocks, lastUpdateTime: new Date()});
  }

  private convertMinute = (minute: string) => {
    return minute;
    // const time = minute.split(':');
    // return parseInt(time[0]) * 60 + parseInt(time[1]);
  }

  private buildStockChartModel = (stock: IStock, chart: Array<IChartResponseData>) => {
    stock.chart = chart
      .filter(val => val.volume > 0)
      .map((val, idx, arr) => {
        return { x: val.minute, y: val.average };
      });
  }
}

export default withStyles(styles)(Stocks);